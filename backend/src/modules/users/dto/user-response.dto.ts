import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
  })
  id!: number;

  @ApiProperty({
    example: 'john.doe',
  })
  username!: string;

  @ApiProperty({
    example: 'John Doe',
  })
  fullName!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email!: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  avatar!: string | null;

  @ApiPropertyOptional({
    example: '+84901234567',
    nullable: true,
  })
  phone!: string | null;

  @ApiPropertyOptional({
    example: 'male',
    nullable: true,
  })
  gender!: string | null;

  @ApiPropertyOptional({
    example: 'Ho Chi Minh City',
    nullable: true,
  })
  address!: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  updatedAt!: Date;

  @ApiPropertyOptional({
    example: 1,
    nullable: true,
  })
  createdBy!: number | null;

  @ApiPropertyOptional({
    example: 1,
    nullable: true,
  })
  updatedBy!: number | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
  })
  deletedAt!: Date | null;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
  })
  deletedBy!: number | null;
}

export class UserPaginationDto {
  @ApiProperty({
    example: 1,
  })
  page!: number;

  @ApiProperty({
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    example: 25,
  })
  totalItems!: number;

  @ApiProperty({
    example: 3,
  })
  totalPages!: number;
}

export class UserListResponseDto {
  @ApiProperty({
    type: () => [UserResponseDto],
  })
  items!: UserResponseDto[];

  @ApiProperty({
    type: () => UserPaginationDto,
  })
  pagination!: UserPaginationDto;
}
