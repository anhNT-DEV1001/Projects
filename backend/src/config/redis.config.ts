import { registerAs } from '@nestjs/config';

function buildRedisUrl(host: string, port: number, password?: string): string {
  const url = new URL('redis://');

  url.hostname = host;
  url.port = String(port);

  if (password) {
    url.password = password;
  }

  return url.toString();
}

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
  password: process.env.REDIS_PASSWORD || 'admin123',
  ttl: parseInt(process.env.REDIS_TTL as string, 10) || 300_000,
  url: buildRedisUrl(
    process.env.REDIS_HOST || '127.0.0.1',
    parseInt(process.env.REDIS_PORT as string, 10) || 6379,
    process.env.REDIS_PASSWORD || 'admin123',
  ),
}));
