import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',

        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),
        username: configService.getOrThrow<string>('database.username'),
        password: configService.getOrThrow<string>('database.password'),
        database: configService.getOrThrow<string>('database.name'),
        schema: configService.get<string>('database.schema', 'public'),

        /*
         * Tự động lấy các entity được khai báo trong
         * TypeOrmModule.forFeature([...]).
         */
        autoLoadEntities: true,

        /*
         * Không dùng synchronize=true trong production.
         * Nên quản lý cấu trúc database bằng migration.
         */
        synchronize: false,

        /*
         * Không tự chạy migration khi start ứng dụng.
         */
        migrationsRun: false,

        migrations: [`${__dirname}/migrations/*{.ts,.js}`],

        subscribers: [`${__dirname}/subscribers/*{.ts,.js}`],

        migrationsTableName: 'typeorm_migrations',

        migrationsTransactionMode: 'all',

        logging: configService.get<boolean>('database.logging', false),

        retryAttempts: 5,
        retryDelay: 3000,

        extra: {
          max: 10,
          connectionTimeoutMillis: 10_000,
          idleTimeoutMillis: 30_000,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
