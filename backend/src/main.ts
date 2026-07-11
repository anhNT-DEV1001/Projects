import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { setupSwagger } from './infrastructure/apis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const host = config.get<string>('app.host', '127.0.0.1');
  const port = config.get<number>('app.port', 3000);
  const prefix = config.get<string>('app.prefix', 'api/v1');
  const cookieSecret = config.get<string>('cookies.secret', 'my-secret');
  const swaggerEnabled = config.get<boolean>('swagger.enabled', true);
  const swaggerPath = config.get<string>('swagger.path', 'docs');

  app.use(cookieParser(cookieSecret));
  app.setGlobalPrefix(prefix);

  if (swaggerEnabled) {
    setupSwagger(app, swaggerPath);
  }

  await app.listen(port, host);
  console.log(`Server running on: http://${host}:${port}/${prefix}`);
  if (swaggerEnabled) {
    console.log(`Swagger: http://${host}:${port}/${swaggerPath}`);
  }
}

void bootstrap();
