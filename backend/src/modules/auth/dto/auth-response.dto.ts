import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserResponseDto } from 'src/modules/users/dto';

export class AuthResponseDto {
  @ApiProperty({
    type: () => UserResponseDto,
  })
  user!: UserResponseDto;

  @ApiProperty({
    example: '1f23a8e4-9c27-4b0f-b681-1af833f1e7a7',
  })
  sessionId!: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
  })
  accessTokenExpiresAt!: Date | null;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    nullable: true,
  })
  refreshTokenExpiresAt!: Date | null;
}

export class AuthenticatedUserDto extends AuthResponseDto {
  id!: number;
  username!: string;
  type!: 'access' | 'refresh';
  tokenHash!: string | null;
}
