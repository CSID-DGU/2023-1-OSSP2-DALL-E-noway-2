import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { NaverStrategy } from './naver/naver.strategy';
import { KakaoStrategy } from './kakao/kakao.strategy';
import { GoogleStrategy } from './google/google.strategy';

@Module({
  imports: [PassportModule],
  providers: [NaverStrategy, KakaoStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
