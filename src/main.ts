import { ReflectionService } from '@grpc/reflection';
import { ClassSerializerInterceptor, HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { MANAGER_V1_PACKAGE_NAME } from './modules/grpc/gen/ts/config';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    cors: true,
    bodyParser: false,
  });
  const configService = app.select(SharedModule).get(ApiConfigService);

  if (configService.isProduction) {
    app.useLogger(['log', 'warn', 'error']);
  }

  // Middleware setup
  app.enableCors({
    origin: '*',
    methods: 'GET,OPTION,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.use(compression());
  app.use(
    morgan('combined', {
      skip: (req) => ['health', '/docs/', 'swagger'].some((path) => req.url?.includes(path)),
    }),
  );
  app.enableVersioning();
  app.enable('trust proxy');

  // Global Interceptors
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  // Swagger setup
  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  // gRPC Microservice configuration
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
      package: MANAGER_V1_PACKAGE_NAME,
      protoPath: configService.grpcConfig.protoPath,
      url: `0.0.0.0:${configService.grpcConfig.port}`,
    },
  });

  // Start server
  await app.startAllMicroservices();
  await app.listen(configService.appConfig.port);

  console.info(`Server is running on ${await app.getUrl()}`);
}

/* eslint-disable unicorn/prefer-top-level-await */
void bootstrap();
