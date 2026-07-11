import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  name: process.env.DB_NAME || 'mydb',
  username: process.env.DB_USERNAME || process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  schema: process.env.DB_SCHEMA || 'public',
  logging: (process.env.DB_LOGGING || 'false').toLowerCase() === 'true',
}));
