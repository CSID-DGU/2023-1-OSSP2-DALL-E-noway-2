import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * passport-kakao의 기본 인증을 사용합니다.
 */
@Injectable()
export class KakaoGuard extends AuthGuard('kakao') {}
