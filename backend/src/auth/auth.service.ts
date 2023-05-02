import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  /**
   * 유저 정보를 바탕으로 JWT 토큰을 생성합니다.
   * @param user
   * @returns JWT 토큰
   */
  generateJwtToken(user: UserDto): string {
    this.logger.debug(`Called ${this.generateJwtToken.name}`);
    return this.jwtService.sign(user);
  }
}
