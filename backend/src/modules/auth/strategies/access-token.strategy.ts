import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { UsersService } from 'src/modules/users/users.service';

import { AuthenticatedUserDto, PayloadDto } from '../dto';
import { UserToken } from '../entities';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(
    configService: ConfigService,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies as
            Record<string, unknown> | undefined;
          const accessTokenName = configService.get<string>(
            'cookies.accessTokenName',
            'access_token',
          );
          const token = cookies?.[accessTokenName];
          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'jwt.accessSecret',
        'access-secret-key',
      ),
    });
  }

  async validate(payload: PayloadDto): Promise<AuthenticatedUserDto> {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Access token không hợp lệ');
    }

    const [user, session] = await Promise.all([
      this.usersService.findUserByIdForAuth(payload.sub),
      this.userTokenRepository.findOne({
        where: {
          sessionId: payload.sessionId,
          userId: payload.sub,
        },
      }),
    ]);

    if (!user || !session || !session.expiresAt) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.userTokenRepository.delete({
        id: session.id,
      });
      throw new UnauthorizedException('Phiên đăng nhập đã hết hạn');
    }

    return {
      user: this.usersService.toUserResponse(user),
      id: user.id,
      username: user.username,
      sessionId: payload.sessionId,
      accessTokenExpiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
      refreshTokenExpiresAt: session.expiresAt,
      type: payload.type,
      tokenHash: session.token,
    };
  }
}
