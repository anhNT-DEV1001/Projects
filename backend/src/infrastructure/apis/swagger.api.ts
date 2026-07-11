import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
  swaggerPath = 'docs',
): void {
  const configService = app.get(ConfigService);
  const refreshTokenCookieName = configService.get<string>(
    'cookies.refreshTokenName',
    'refresh_token',
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('API documentation for Backend application')
    .setVersion('1.0.0')

    // Access token truyền qua Authorization header
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập JWT access token',
      },
      'access-token',
    )

    // Refresh token lưu trong cookie
    .addCookieAuth(
      refreshTokenCookieName,
      {
        type: 'apiKey',
        in: 'cookie',
      },
      'refresh-token',
    )

    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(swaggerPath, app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    jsonDocumentUrl: `${swaggerPath}/json`,
  });
}
