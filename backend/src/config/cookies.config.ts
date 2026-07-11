import { registerAs } from '@nestjs/config';

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

export default registerAs('cookies', () => ({
  accessTokenName: process.env.ACCESS_TOKEN_COOKIE_NAME || 'access_token',
  refreshTokenName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refresh_token',
  domain: process.env.COOKIE_DOMAIN || undefined,
  secure: parseBoolean(process.env.COOKIE_SECURE, false),
  secret: process.env.COOKIE_SECRET,
  sameSite:
    (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none' | undefined) ||
    'lax',
}));
