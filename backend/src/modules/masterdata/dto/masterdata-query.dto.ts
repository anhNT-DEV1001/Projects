import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MasterDataQueryDto {
  @ApiPropertyOptional({
    description: 'Từ khóa lọc theo dataKey',
    example: 'GENDER',
  })
  @IsOptional()
  @IsString()
  dataKey?: string;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên một trang',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Số trang truy vấn',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  page?: number;
}