import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { AppModule } from './app.module';
import { setupSwagger } from './infrastructure/apis';

function normalizeRoutePath(path: string): string {
  return path
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

function buildSwaggerPath(apiPrefix: string, swaggerPath: string): string {
  const normalizedPrefix = normalizeRoutePath(apiPrefix);
  const normalizedSwaggerPath = normalizeRoutePath(swaggerPath);

  if (!normalizedPrefix) {
    return normalizedSwaggerPath;
  }

  if (
    !normalizedSwaggerPath ||
    normalizedSwaggerPath === normalizedPrefix ||
    normalizedSwaggerPath.startsWith(`${normalizedPrefix}/`)
  ) {
    return normalizedSwaggerPath || normalizedPrefix;
  }

  return `${normalizedPrefix}/${normalizedSwaggerPath}`;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const host = config.get<string>('app.host', '127.0.0.1');
  const port = config.get<number>('app.port', 3000);
  const prefix = config.get<string>('app.prefix', 'api/v1');
  const cookieSecret = config.get<string>('cookies.secret', 'my-secret');
  const corsOrigins = config.get<string[]>('cors.origin', [
    'http://localhost:5050',
    'http://127.0.0.1:5050',
  ]);
  const corsCredentials = config.get<boolean>('cors.credentials', true);
  const uploadDir = config.get<string>('upload.dir', 'uploads');
  const uploadPath = join(process.cwd(), uploadDir);
  const swaggerEnabled = config.get<boolean>('swagger.enabled', true);
  const swaggerPath = config.get<string>('swagger.path', 'docs');
  const swaggerFullPath = buildSwaggerPath(prefix, swaggerPath);

  app.enableCors({
    origin: corsOrigins,
    credentials: corsCredentials,
  });
  mkdirSync(uploadPath, { recursive: true });
  app.useStaticAssets(uploadPath, {
    prefix: '/uploads/',
  });
  app.use(cookieParser(cookieSecret));
  app.setGlobalPrefix(prefix);

  if (swaggerEnabled) {
    setupSwagger(app, swaggerFullPath);
  }

  await app.listen(port, host);
  console.log(`Server running on: http://${host}:${port}/${prefix}`);
  if (swaggerEnabled) {
    console.log(`Swagger: http://${host}:${port}/${swaggerFullPath}`);
  }
}

void bootstrap();
