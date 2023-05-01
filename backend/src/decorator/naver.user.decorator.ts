import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SocialProfile } from 'src/type/social.profile';

export const RequestNaverProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SocialProfile => {
    const request = ctx.switchToHttp().getRequest();
    return {
      oauthId: request.user.id,
      provider: request.user.provider,
      imageUrl: request.user._json.profile_image,
      username: request.user.displayName,
      email: request.user._json.email,
    } as SocialProfile;
  },
);
