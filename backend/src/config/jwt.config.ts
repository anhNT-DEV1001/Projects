import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  accessSecret: process.env.ACCESS_SECRET || 'access-secret-key',
  refreshSecret: process.env.REFRESH_SECRET || 'refresh-secret-key',
  accessExpiresIn: process.env.ACCESS_EXPIRES || '15m',
  refreshExpiresIn: process.env.REFRESH_EXPIRES || '7d',
}));
