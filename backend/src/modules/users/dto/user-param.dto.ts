import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UserParamDto {
  @ApiProperty({
    example: 1,
    minimum: 1,
  })
  @IsInt({
    message: 'Id người dùng phải là số nguyên',
  })
  @Min(1, {
    message: 'Id người dùng phải lớn hơn hoặc bằng 1',
  })
  id!: number;
}
