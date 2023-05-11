import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export { UserDto } from 'src/dto/user.dto';

//import { User } from 'src/entities/user.entity';

/**
 * req의 user 필드에서 값을 가져오는 커스텀 데코레이터
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
