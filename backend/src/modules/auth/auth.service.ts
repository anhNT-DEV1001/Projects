import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { Response } from 'express';
import { Repository } from 'typeorm';

import { RequestMetaDto } from 'src/common/decorators';
import { User } from 'src/modules/users/entities';
import { UsersService } from '../users/users.service';

import {
  AuthenticatedUserDto,
  AuthResponseDto,
  LoginDto,
  PayloadDto,
} from './dto';
import { UserToken } from './entities';

interface TokenBundle {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    loginDto: LoginDto,
    meta: RequestMetaDto,
    response: Response,
  ): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto);
    const sessionId = randomUUID();
    const tokens = await this.generateToken(user, sessionId);

    await this.userTokenRepository.save(
      this.userTokenRepository.create({
        userId: user.id,
        ip: meta.ip,
        agent: meta.userAgent,
        sessionId,
        token: await this.hashToken(tokens.refreshToken),
        expiresAt: tokens.refreshTokenExpiresAt,
      }),
    );

    this.attachAuthCookies(response, tokens);

    return this.buildAuthResponse(user, sessionId, tokens);
  }

  async refreshToken(
    currentUser: AuthenticatedUserDto,
    meta: RequestMetaDto,
    response: Response,
  ): Promise<AuthResponseDto> {
    const session = await this.userTokenRepository.findOne({
      where: {
        sessionId: currentUser.sessionId,
        userId: currentUser.id,
      },
    });

    if (!session || !session.token || !session.expiresAt) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.userTokenRepository.delete({
        id: session.id,
      });
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    if (!currentUser.tokenHash || session.token !== currentUser.tokenHash) {
      await this.userTokenRepository.delete({
        id: session.id,
      });
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    const user = await this.userService.findUserByIdWithPassword(
      currentUser.id,
    );
    const tokens = await this.generateToken(user, session.sessionId);

    session.ip = meta.ip;
    session.agent = meta.userAgent;
    session.token = await this.hashToken(tokens.refreshToken);
    session.expiresAt = tokens.refreshTokenExpiresAt;

    await this.userTokenRepository.save(session);

    this.attachAuthCookies(response, tokens);

    return this.buildAuthResponse(user, session.sessionId, tokens);
  }

  me(currentUser: AuthenticatedUserDto): AuthResponseDto {
    return this.toAuthResponse(currentUser);
  }

  async logout(
    currentUser: AuthenticatedUserDto,
    response: Response,
  ): Promise<null> {
    await this.userTokenRepository.delete({
      sessionId: currentUser.sessionId,
      userId: currentUser.id,
    });
    this.clearAuthCookies(response);
    return null;
  }

  private async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.findUserByUsernameForAuth(
      loginDto.username,
    );

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const isMatchPass = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatchPass) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    return user;
  }

  private async generateToken(
    user: User,
    sessionId: string,
  ): Promise<TokenBundle> {
    const accessExpiresIn = this.configService.get<string>(
      'jwt.accessExpiresIn',
      '15m',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );

    const accessTokenTtlMs = this.resolveDurationMs(accessExpiresIn);
    const refreshTokenTtlMs = this.resolveDurationMs(refreshExpiresIn);
    const accessTokenExpiresAt = new Date(Date.now() + accessTokenTtlMs);
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTtlMs);

    const accessPayload: PayloadDto = {
      sub: user.id,
      username: user.username,
      sessionId,
      type: 'access',
    };
    const refreshPayload: PayloadDto = {
      ...accessPayload,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.get<string>(
          'jwt.accessSecret',
          'access-secret-key',
        ),
        expiresIn: Math.floor(accessTokenTtlMs / 1000),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>(
          'jwt.refreshSecret',
          'refresh-secret-key',
        ),
        expiresIn: Math.floor(refreshTokenTtlMs / 1000),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  private attachAuthCookies(response: Response, tokens: TokenBundle): void {
    const accessTokenName = this.configService.get<string>(
      'cookies.accessTokenName',
      'access_token',
    );
    const refreshTokenName = this.configService.get<string>(
      'cookies.refreshTokenName',
      'refresh_token',
    );
    const domain = this.configService.get<string | undefined>('cookies.domain');
    const secure = this.configService.get<boolean>('cookies.secure', false);
    const sameSite = this.configService.get<
      boolean | 'lax' | 'strict' | 'none'
    >('cookies.sameSite', 'lax');

    response.cookie(accessTokenName, tokens.accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      path: '/',
      expires: tokens.accessTokenExpiresAt,
    });

    response.cookie(refreshTokenName, tokens.refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      path: '/',
      expires: tokens.refreshTokenExpiresAt,
    });
  }

  private clearAuthCookies(response: Response): void {
    const domain = this.configService.get<string | undefined>('cookies.domain');
    const secure = this.configService.get<boolean>('cookies.secure', false);
    const sameSite = this.configService.get<
      boolean | 'lax' | 'strict' | 'none'
    >('cookies.sameSite', 'lax');

    response.clearCookie(
      this.configService.get<string>('cookies.accessTokenName', 'access_token'),
      {
        httpOnly: true,
        secure,
        sameSite,
        domain,
        path: '/',
      },
    );
    response.clearCookie(
      this.configService.get<string>(
        'cookies.refreshTokenName',
        'refresh_token',
      ),
      {
        httpOnly: true,
        secure,
        sameSite,
        domain,
        path: '/',
      },
    );
  }

  private resolveDurationMs(value: string): number {
    const trimmed = value.trim();
    const matched = /^(\d+)([smhd])$/.exec(trimmed);

    if (!matched) {
      const fallback = Number.parseInt(trimmed, 10);

      return Number.isNaN(fallback) ? 0 : fallback * 1000;
    }

    const amount = Number.parseInt(matched[1], 10);
    const unit = matched[2];
    const multiplier =
      unit === 's'
        ? 1000
        : unit === 'm'
          ? 60_000
          : unit === 'h'
            ? 3_600_000
            : 86_400_000;

    return amount * multiplier;
  }

  private async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  private buildAuthResponse(
    user: User,
    sessionId: string,
    tokens: TokenBundle,
  ): AuthResponseDto {
    return {
      user: this.userService.toUserResponse(user),
      sessionId,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    };
  }

  private toAuthResponse(currentUser: AuthenticatedUserDto): AuthResponseDto {
    return {
      user: currentUser.user,
      sessionId: currentUser.sessionId,
      accessTokenExpiresAt: currentUser.accessTokenExpiresAt,
      refreshTokenExpiresAt: currentUser.refreshTokenExpiresAt,
    };
  }
}
