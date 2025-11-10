import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { COOKIE_NAMES } from 'src/modules/auth/constants/auth.constants';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token =
      request?.headers?.authorization?.replace('Bearer ', '') ||
      request?.cookies?.[COOKIE_NAMES.JWT];

    const userId: any = jwtDecode(token);
    // console.log(userId);
    return userId.id;
  },
);
