import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { UsersService } from 'src/modules/users/users.service';

import { AuthenticatedUserDto, PayloadDto } from '../dto';
import { UserToken } from '../entities';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookies = request.cookies as
            Record<string, unknown> | undefined;
          const refreshTokenName = configService.get<string>(
            'cookies.refreshTokenName',
            'refresh_token',
          );
          const token = cookies?.[refreshTokenName];
          return typeof token === 'string' ? token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'jwt.refreshSecret',
        'refresh-secret-key',
      ),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: PayloadDto,
  ): Promise<AuthenticatedUserDto> {
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const cookies = request.cookies as Record<string, unknown> | undefined;
    const refreshTokenName = this.getRefreshTokenName();
    const rawRefreshToken = cookies?.[refreshTokenName];

    if (typeof rawRefreshToken !== 'string') {
      throw new UnauthorizedException('Không tìm thấy refresh token');
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

    if (!user || !session || !session.token || !session.expiresAt) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }

    const isTokenMatch = await bcrypt.compare(rawRefreshToken, session.token);

    if (!isTokenMatch) {
      await this.userTokenRepository.delete({
        id: session.id,
      });
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.userTokenRepository.delete({
        id: session.id,
      });
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    return {
      user: this.usersService.toUserResponse(user),
      id: user.id,
      username: user.username,
      sessionId: payload.sessionId,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: payload.exp
        ? new Date(payload.exp * 1000)
        : session.expiresAt,
      type: payload.type,
      tokenHash: session.token,
    };
  }

  private getRefreshTokenName(): string {
    return this.getConfigValue('cookies.refreshTokenName', 'refresh_token');
  }

  private getConfigValue(key: string, fallback: string): string {
    return this.configService.get<string>(key, fallback);
  }
}
