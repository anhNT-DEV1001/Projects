import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';

import { User } from './entities';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uploadDir = configService.get<string>('upload.dir', 'uploads');
        const avatarDir = configService.get<string>(
          'upload.avatarDir',
          'avatars',
        );
        const maxAvatarSizeMb = configService.get<number>(
          'upload.maxAvatarSizeMb',
          5,
        );
        const destination = join(process.cwd(), uploadDir, avatarDir);

        return {
          storage: diskStorage({
            destination: (_request, _file, callback) => {
              mkdirSync(destination, { recursive: true });
              callback(null, destination);
            },
            filename: (_request, file, callback) => {
              const extension = extname(file.originalname).toLowerCase();
              callback(null, `${randomUUID()}${extension}`);
            },
          }),
          fileFilter: (_request, file, callback) => {
            if (!/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
              callback(
                new BadRequestException(
                  'Avatar chỉ hỗ trợ định dạng JPG, PNG hoặc WEBP',
                ),
                false,
              );
              return;
            }

            callback(null, true);
          },
          limits: {
            fileSize: maxAvatarSizeMb * 1024 * 1024,
          },
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
