import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

import { description, name, version } from '../package.json';

export function setupSwagger(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder().setTitle(name).setDescription(description).addBearerAuth();

  if (version) {
    documentBuilder.setVersion(version);
  }

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  const theme = new SwaggerTheme();
  SwaggerModule.setup('docs', app, document, {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.NORD_DARK),
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  console.info(`Documentation: http://localhost:${process.env.PORT}/docs`);
}
