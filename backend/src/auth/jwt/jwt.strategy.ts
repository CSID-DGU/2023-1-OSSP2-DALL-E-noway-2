import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

/**
 * request에서 토큰을 추출합니다.
 * @param req
 * @returns
 */
const extracter = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }
  return token;
};

/**
 * JWT를 사용한 인증 전략을 구현합니다.
 * PassportStrategy를 상속받아 validate 메서드를 구현합니다.
 * validate 메서드는 request에서 추출한 토큰을 통해 유저 정보를 검증합니다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: extracter,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * request에서 추출한 토큰을 통해 유저 정보를 검증합니다.
   * @param payload
   * @returns
   */
  async validate(payload: any) {
    // 토큰에 들어있는 유저 정보가 DB에 존재하는지 확인
    const exist = await this.userService.checkUserExistById(payload.userId);
    if (!exist) {
      return false;
    }
    return payload;
  }
}
