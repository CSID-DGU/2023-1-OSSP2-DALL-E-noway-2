import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('kakao.clientID'),
      clientSecret: configService.get<string>('kakao.clientSecret'),
      callbackURL: configService.get<string>('kakao.callbackURL'),
    });
  }

  validate(accessToken, refreshToken, profile, callback) {
    callback(null, profile);
  }
}
