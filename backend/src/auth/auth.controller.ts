import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NaverGuard } from './naver/naver.guard';
import { RequestNaverProfile } from 'src/decorator/naver.user.decorator';
import { Response } from 'express';
import { SocialProfile } from 'src/type/social.profile';
import { KakaoGuard } from './kakao/kakao.guard';
import { RequestKakaoProfile } from 'src/decorator/kakao.user.decorator';
import { GoogleGuard } from './google/google.guard';
import { RequestGoogleProfile } from 'src/decorator/google.user.decorator';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: '네이버 로그인',
    description:
      '네이버 로그인을 위한 endpoint 입니다. 이후 자동으로 네이버 로그인 페이지로 리다이렉트 됩니다.',
  })
  @Get('naver/login')
  @UseGuards(NaverGuard)
  naverLogin() {
    // Cannot reach here
    return;
  }

  @ApiOperation({
    summary: '네이버 로그인 시도 후 처리에 대한 요청입니다.',
    description:
      '네이버 로그인 시도 후 OAuth 인증이 완료되면 해당 URI로 자동으로 리다이렉트 됩니다. 유저가 존재하지 않으면 유저를 생성하고, JWT 토큰을 발급 후 쿠키에 저장합니다.',
  })
  @Get('naver/login/callback')
  @UseGuards(NaverGuard)
  async naverLoginCallback(
    @RequestNaverProfile() profile: SocialProfile,
    @Res() res: Response,
  ) {
    this.logger.debug(`Called ${this.naverLoginCallback.name}`);
    try {
      // 유저가 존재하지 않으면 유저를 생성하고, 유저 정보를 반환합니다.
      const user = await this.userService.findOrCreateUserBySocialProfile(
        profile,
      );

      // JWT 토큰을 발급 후 쿠키에 저장합니다.
      const token = this.authService.generateJwtToken(user);
      res.cookie('accessToken', token);

      // NOTE: 이후에는 프론트엔드로 리다이렉트 합니다.
      return res.redirect(this.configService.get<string>('feHost') + '/home');
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '카카오 로그인',
    description:
      '카카오 로그인을 위한 endpoint 입니다. 이후 자동으로 카카오 로그인 페이지로 리다이렉트 됩니다.',
  })
  @Get('kakao/login')
  @UseGuards(KakaoGuard)
  kakaoLogin() {
    // Cannot reach here
    return;
  }

  @ApiOperation({
    summary: '카카오 로그인 시도 후 처리에 대한 요청입니다.',
    description:
      '카카오 로그인 시도 후 OAuth 인증이 완료되면 해당 URI로 자동으로 리다이렉트 됩니다. 유저가 존재하지 않으면 유저를 생성하고, JWT 토큰을 발급 후 쿠키에 저장합니다.',
  })
  @Get('kakao/login/callback')
  @UseGuards(KakaoGuard)
  async kakaoLoginCallback(
    @RequestKakaoProfile() profile: SocialProfile,
    @Res() res: Response,
  ) {
    this.logger.debug(`Called ${this.kakaoLoginCallback.name}`);
    try {
      // 유저가 존재하지 않으면 유저를 생성하고, 유저 정보를 반환합니다.
      const user = await this.userService.findOrCreateUserBySocialProfile(
        profile,
      );

      // JWT 토큰을 발급 후 쿠키에 저장합니다.
      const token = this.authService.generateJwtToken(user);
      res.cookie('accessToken', token);

      // NOTE: 이후에는 프론트엔드로 리다이렉트 합니다.
      return res.redirect(this.configService.get<string>('feHost') + '/home');
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '구글 로그인',
    description:
      '구글 로그인을 위한 endpoint 입니다. 이후 자동으로 구글 로그인 페이지로 리다이렉트 됩니다.',
  })
  @Get('google/login')
  @UseGuards(GoogleGuard)
  googleLogin() {
    // Cannot reach here
    return;
  }

  @ApiOperation({
    summary: '구글 로그인 시도 후 처리에 대한 요청입니다.',
    description:
      '구글 로그인 시도 후 OAuth 인증이 완료되면 해당 URI로 자동으로 리다이렉트 됩니다. 유저가 존재하지 않으면 유저를 생성하고, JWT 토큰을 발급 후 쿠키에 저장합니다.',
  })
  @Get('google/login/callback')
  @UseGuards(GoogleGuard)
  async googleLoginCallback(
    @RequestGoogleProfile() profile: SocialProfile,
    @Res() res: Response,
  ) {
    this.logger.debug(`Called ${this.googleLoginCallback.name}`);
    try {
      // 유저가 존재하지 않으면 유저를 생성하고, 유저 정보를 반환합니다.
      const user = await this.userService.findOrCreateUserBySocialProfile(
        profile,
      );

      // JWT 토큰을 발급 후 쿠키에 저장합니다.
      const token = this.authService.generateJwtToken(user);
      res.cookie('accessToken', token);

      // NOTE: 이후에는 프론트엔드로 리다이렉트 합니다.
      return res.redirect(this.configService.get<string>('feHost') + '/home');
    } catch (err) {
      this.logger.error(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }
}
