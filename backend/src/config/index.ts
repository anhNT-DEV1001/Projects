import appConfig from './app.config';
import cookiesConfig from './cookies.config';
import corsConfig from './cors.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import rateLimitConfig from './rate-limit.config';
import swaggerConfig from './swagger.config';
import uploadConfig from './upload.config';

export const configurations = [
  appConfig,
  databaseConfig,
  redisConfig,
  rateLimitConfig,
  cookiesConfig,
  corsConfig,
  jwtConfig,
  swaggerConfig,
  uploadConfig,
];
