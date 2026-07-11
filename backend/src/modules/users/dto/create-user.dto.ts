import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe',
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
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message:
      'Tên đăng nhập chỉ được chứa chữ cái, số, dấu chấm và dấu gạch dưới',
  })
  username!: string;

  @ApiProperty({
    example: '123456',
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

  @ApiProperty({
    example: 'John Doe',
  })
  @IsString({
    message: 'Họ và tên phải là chuỗi',
  })
  @MinLength(2, {
    message: 'Họ và tên phải có ít nhất 2 ký tự',
  })
  @MaxLength(255, {
    message: 'Họ và tên không được vượt quá 255 ký tự',
  })
  fullName!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  @MaxLength(255, {
    message: 'Email không được vượt quá 255 ký tự',
  })
  email!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'Avatar phải là chuỗi',
  })
  @MaxLength(255, {
    message: 'Avatar không được vượt quá 255 ký tự',
  })
  avatar?: string | null;

  @ApiPropertyOptional({
    example: '+84901234567',
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'Số điện thoại phải là chuỗi',
  })
  @Matches(/^[0-9+\-\s]{8,20}$/, {
    message: 'Số điện thoại không đúng định dạng',
  })
  phone?: string | null;

  @ApiPropertyOptional({
    example: 'male',
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'Giới tính phải là chuỗi',
  })
  gender?: string | null;

  @ApiPropertyOptional({
    example: 'Ho Chi Minh City',
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'Địa chỉ phải là chuỗi',
  })
  @MaxLength(255, {
    message: 'Địa chỉ không được vượt quá 255 ký tự',
  })
  address?: string | null;
}
