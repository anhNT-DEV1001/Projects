import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
    description: 'Tên đăng nhập',
  })
  @IsString({
    message: 'Tên đăng nhập phải là chuỗi',
  })
  @MinLength(3, {
    message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
  })
  @MaxLength(100, {
    message: 'Tên đăng nhập không được vượt quá 100 ký tự',
  })
  username!: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu đăng nhập',
  })
  @IsString({
    message: 'Mật khẩu phải là chuỗi',
  })
  @MinLength(6, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự',
  })
  @MaxLength(100, {
    message: 'Mật khẩu không được vượt quá 100 ký tự',
  })
  password!: string;
}
