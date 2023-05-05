import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SocialProfile } from 'src/type/social.profile';

/**
 * 카카오 로그인 후, payload로 전달받은 유저 정보를 가져오는 커스텀 데코레이터
 */
export const RequestKakaoProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SocialProfile => {
    const request = ctx.switchToHttp().getRequest();
    return {
      oauthId: String(request.user.id),
      provider: request.user.provider,
      imageUrl: request.user._json.properties.profile_image,
      username: request.user.displayName,
      email: request.user._json.kakao_account.email,
    } as SocialProfile;
  },
);
