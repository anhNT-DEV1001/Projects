import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        stores: [createKeyv(configService.getOrThrow<string>('redis.url'))],

        ttl: configService.get<number>('redis.ttl', 300_000),
      }),
    }),
  ],

  providers: [CacheService],

  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
