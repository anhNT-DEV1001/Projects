import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { AuthenticatedUserDto } from 'src/modules/auth/dto';
import { UserResponseDto } from 'src/modules/users/dto';

type CurrentUserKey = keyof AuthenticatedUserDto | keyof UserResponseDto;

export const CurrentUser = createParamDecorator(
  (data: CurrentUserKey | undefined, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUserDto }>();
    const user = request.user;

    if (!user) {
      return undefined;
    }

    if (!data) {
      return user;
    }

    if (data in user) {
      return user[data as keyof AuthenticatedUserDto];
    }

    return user.user[data as keyof UserResponseDto];
  },
);
