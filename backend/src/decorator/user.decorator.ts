import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//로그인한 user 객체에 접근하기 위한 커스텀 데코레이터
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
