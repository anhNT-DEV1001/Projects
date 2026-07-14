import { registerAs } from '@nestjs/config';

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.trim().toLowerCase() === 'true';
}

function parseOrigins(value: string | undefined): string[] {
  if (!value) {
    return ['http://localhost:5050', 'http://127.0.0.1:5050'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default registerAs('cors', () => ({
  origin: parseOrigins(process.env.CORS_ORIGIN),
  credentials: parseBoolean(process.env.CORS_CREDENTIALS, true),
}));
