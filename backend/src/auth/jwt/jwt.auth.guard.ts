import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * passport-jwt의 기본 인증을 사용합니다.
 * 추가로 유효하지 않은 토큰이거나 만료된 토큰에 대한 401 예외처리를 합니다.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          '로그인 정보가 만료되었습니다. \n다시 로그인해주세요.',
        )
      );
    }
    return user;
  }
}
