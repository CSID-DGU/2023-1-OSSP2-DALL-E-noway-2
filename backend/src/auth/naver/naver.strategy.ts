import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('naver.clientID'),
      clientSecret: configService.get<string>('naver.clientSecret'),
      callbackURL: configService.get<string>('naver.callbackURL'),
    });
  }

  validate(accessToken, refreshToken, profile, callback) {
    callback(null, profile);
  }
}
