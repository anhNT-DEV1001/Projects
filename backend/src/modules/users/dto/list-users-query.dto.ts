import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListUsersQueryDto {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt({
    message: 'Trang hiện tại phải là số nguyên',
  })
  @Min(1, {
    message: 'Trang hiện tại phải lớn hơn hoặc bằng 1',
  })
  page = 1;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsInt({
    message: 'Giới hạn bản ghi phải là số nguyên',
  })
  @Min(1, {
    message: 'Giới hạn bản ghi phải lớn hơn hoặc bằng 1',
  })
  @Max(100, {
    message: 'Giới hạn bản ghi không được vượt quá 100',
  })
  limit = 10;

  @ApiPropertyOptional({
    example: 'john',
  })
  @IsOptional()
  @IsString({
    message: 'Từ khóa tìm kiếm phải là chuỗi',
  })
  keyword?: string;

  @ApiPropertyOptional({
    example: 'male',
  })
  @IsOptional()
  @IsString({
    message: 'Từ giới tính phải là chuỗi',
  })
  gender?: string;
}
