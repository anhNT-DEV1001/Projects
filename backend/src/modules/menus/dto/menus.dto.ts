import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MenuDto {
  @ApiPropertyOptional({
    description: 'ID của menu (nếu cập nhật)',
    example: 1,
  })
  @IsOptional()
  id?: number;

  @ApiPropertyOptional({
    description: 'Tiêu đề hiển thị của menu',
    example: 'Trang chủ',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn liên kết',
    example: '/home',
  })
  @IsOptional()
  @IsString()
  href?: string;

  @ApiPropertyOptional({
    description: 'Icon hiển thị của menu',
    example: 'home-icon',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự hiển thị',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({
    description: 'Bí danh / định danh menu',
    example: 'home',
  })
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiPropertyOptional({
    description: 'ID của menu cha (nếu là menu con)',
    example: '2',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}

export class MenuResponseDto {
  @ApiProperty({
    description: 'ID của menu',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Tiêu đề hiển thị của menu',
    example: 'Trang chủ',
  })
  title!: string;

  @ApiProperty({
    description: 'Đường dẫn liên kết',
    example: '/home',
  })
  href!: string;

  @ApiProperty({
    description: 'Icon hiển thị của menu',
    example: 'home-icon',
  })
  icon!: string;

  @ApiProperty({
    description: 'Thứ tự hiển thị',
    example: 1,
  })
  order!: number;

  @ApiProperty({
    description: 'Bí danh / định danh menu',
    example: 'home',
  })
  alias!: string;

  @ApiPropertyOptional({
    description: 'ID của menu cha',
    example: '2',
    nullable: true,
  })
  parentId?: string | null;

  @ApiPropertyOptional({
    description: 'Các menu con',
    type: () => [MenuResponseDto],
  })
  children?: MenuResponseDto[];

  @ApiProperty({
    description: 'Thời điểm tạo',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Thời điểm cập nhật cuối',
    type: String,
    format: 'date-time',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    description: 'ID người tạo',
    example: 1,
    nullable: true,
  })
  createdBy!: number | null;

  @ApiPropertyOptional({
    description: 'ID người cập nhật cuối',
    example: 1,
    nullable: true,
  })
  updatedBy!: number | null;

  @ApiPropertyOptional({
    description: 'Thời điểm xóa mềm',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  deletedAt!: Date | null;

  @ApiPropertyOptional({
    description: 'ID người xóa',
    example: null,
    nullable: true,
  })
  deletedBy!: number | null;
}