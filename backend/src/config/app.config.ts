import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.PORT as string, 10) || 9000,
  env: process.env.ENV || 'development',
  prefix: process.env.PREFIX || 'api/v1',
}));
