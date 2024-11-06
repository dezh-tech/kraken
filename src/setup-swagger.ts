import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {version, name, description} from '../package.json'

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .addBearerAuth();

  if (version) {
    documentBuilder.setVersion(version);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.info(
    `Documentation: http://localhost:${process.env.PORT}/docs`,
  );
}
