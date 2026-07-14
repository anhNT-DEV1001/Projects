import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'burst',

            ttl: seconds(
              configService.get<number>('rateLimit.burst.ttlSeconds', 10),
            ),

            limit: configService.get<number>('rateLimit.burst.limit', 30),

            blockDuration: seconds(
              configService.get<number>('rateLimit.burst.blockSeconds', 10),
            ),
          },

          {
            name: 'sustained',

            ttl: seconds(
              configService.get<number>('rateLimit.sustained.ttlSeconds', 60),
            ),

            limit: configService.get<number>('rateLimit.sustained.limit', 120),

            blockDuration: seconds(
              configService.get<number>('rateLimit.sustained.blockSeconds', 60),
            ),
          },
        ],

        errorMessage: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.',
      }),
    }),
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RateLimitModule {}
