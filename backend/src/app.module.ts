import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configurations } from './config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MenusModule } from './modules/menus/menus.module';
import { MasterdataModule } from './modules/masterdata/masterdata.module';
import { CommonModule } from './common/comon.module';
import { RateLimitModule } from './infrastructure/rate-limit/rate-limit.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
    }),
    DatabaseModule,
    CacheModule,
    CommonModule,
    RateLimitModule,
    UsersModule,
    AuthModule,
    MenusModule,
    MasterdataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
