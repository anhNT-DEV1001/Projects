import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MasterDataDto {
  @ApiPropertyOptional({
    description: 'ID của master data (nếu cập nhật)',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiPropertyOptional({
    description: 'Khóa chính phân loại dữ liệu (ví dụ: GENDER, ROLE)',
    example: 'GENDER',
  })
  @IsString()
  @IsOptional()
  dataKey?: string;

  @ApiPropertyOptional({
    description: 'Giá trị của thuộc tính (ví dụ: MALE, FEMALE)',
    example: 'MALE',
  })
  @IsString()
  @IsOptional()
  dataValue?: string;

  @ApiPropertyOptional({
    description: 'Loại dữ liệu (nếu có)',
    example: 'SYS_MEMBER',
  })
  @IsString()
  @IsOptional()
  dataType?: string;

  @ApiPropertyOptional({
    description: 'Tên loại dữ liệu (nếu có)',
    example: 'Thành viên hệ thống',
  })
  @IsString()
  @IsOptional()
  dataTypeName?: string;

  @ApiPropertyOptional({
    description: 'Tên hiển thị của giá trị dữ liệu',
    example: 'Nam',
  })
  @IsString()
  @IsOptional()
  dataValueName?: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết cho thuộc tính',
    example: 'Giới tính nam',
  })
  @IsString()
  @IsOptional()
  dataDescription?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp hiển thị',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  dataOrder?: number;
}

export class MasterDataResponseDto {
  @ApiProperty({
    description: 'ID của master data',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Khóa phân loại dữ liệu',
    example: 'GENDER',
  })
  dataKey!: string;

  @ApiProperty({
    description: 'Giá trị dữ liệu',
    example: 'MALE',
  })
  dataValue!: string;

  @ApiProperty({
    description: 'Tên hiển thị của giá trị',
    example: 'Nam',
  })
  dataValueName!: string;

  @ApiProperty({
    description: 'Tên khóa dữ liệu',
    example: 'Giới tính',
  })
  dataKeyName!: string;

  @ApiProperty({
    description: 'Thứ tự sắp xếp hiển thị',
    example: 1,
  })
  dataOrder!: number;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết cho thuộc tính',
    example: 'Giới tính nam',
    nullable: true,
  })
  dataDescription!: string | null;

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

export class MasterDataNameAndValueResponseDto {
  @ApiProperty({
    description: 'Khóa phân loại dữ liệu',
    example: 'GENDER',
  })
  dataKey!: string;

  @ApiProperty({
    description: 'Giá trị dữ liệu',
    example: 'MALE',
  })
  dataValue!: string;

  @ApiProperty({
    description: 'Tên hiển thị của giá trị',
    example: 'Nam',
  })
  dataValueName!: string;
}

export class MasterDataListResponseDto {
  @ApiProperty({
    description: 'Danh sách master data',
    type: () => [MasterDataResponseDto],
  })
  data!: MasterDataResponseDto[];

  @ApiProperty({
    description: 'Tổng số bản ghi',
    example: 25,
  })
  total!: number;
}