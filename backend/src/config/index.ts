import appConfig from './app.config';
import cookiesConfig from './cookies.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import swaggerConfig from './swagger.config';

export const configurations = [
  appConfig,
  databaseConfig,
  redisConfig,
  cookiesConfig,
  jwtConfig,
  swaggerConfig,
];
