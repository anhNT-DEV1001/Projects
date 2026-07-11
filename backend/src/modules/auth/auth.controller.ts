import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import {
  ApiSuccessResponse,
  CurrentUser,
  Public,
  RequestMeta,
  ResponseMessage,
} from 'src/common/decorators';
import type { RequestMetaDto } from 'src/common/decorators';

import { AuthenticatedUserDto, AuthResponseDto, LoginDto } from './dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description:
      'Xác thực người dùng và thiết lập access token cùng refresh token qua cookie.',
  })
  @ApiSuccessResponse(AuthResponseDto, {
    description: 'Đăng nhập thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Thông tin xác thực không hợp lệ',
  })
  @ResponseMessage('Đăng nhập thành công')
  login(
    @Body() loginDto: LoginDto,
    @RequestMeta() meta: RequestMetaDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto, meta, response);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Làm mới token',
    description: 'Dùng refresh token trong cookie để cấp mới bộ token.',
  })
  @ApiCookieAuth('refresh-token')
  @ApiSuccessResponse(AuthResponseDto, {
    description: 'Làm mới token thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token không hợp lệ hoặc đã hết hạn',
  })
  @ResponseMessage('Làm mới token thành công')
  refresh(
    @CurrentUser() currentUser: AuthenticatedUserDto,
    @RequestMeta() meta: RequestMetaDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(currentUser, meta, response);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Lấy thông tin người dùng hiện tại',
  })
  @ApiSuccessResponse(AuthResponseDto, {
    description: 'Lấy thông tin người dùng hiện tại thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không hợp lệ hoặc đã hết hạn',
  })
  @ResponseMessage('Lấy thông tin người dùng hiện tại thành công')
  me(@CurrentUser() currentUser: AuthenticatedUserDto) {
    return this.authService.me(currentUser);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Xóa phiên đăng nhập hiện tại và xóa cookie xác thực.',
  })
  @ApiSuccessResponse(undefined, {
    description: 'Đăng xuất thành công',
    nullable: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không hợp lệ hoặc đã hết hạn',
  })
  @ResponseMessage('Đăng xuất thành công')
  logout(
    @CurrentUser() currentUser: AuthenticatedUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(currentUser, response);
  }
}
