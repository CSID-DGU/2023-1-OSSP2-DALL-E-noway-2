import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { SocialProfile } from 'src/type/social.profile';

/**
 * UserService에 대한 가짜 구현체입니다.
 * 개발 단계에서만 사용하며, 추후 구현이 완료되면 사용하지 않습니다.
 */
@Injectable()
export class MockUserService {
  private logger = new Logger(MockUserService.name);

  /**
   * SocialProfile을 받아서 유저를 생성하거나, 유저가 존재하면 유저 정보를 반환합니다.
   * @param profile
   */
  async findOrCreateUserBySocialProfile(
    profile: SocialProfile,
  ): Promise<UserDto> {
    this.logger.debug(`Called ${this.findOrCreateUserBySocialProfile.name}`);
    profile;
    return {
      userId: 1,
      nickname: '닉네임1',
      imageUrl: 'https://example.com',
    };
  }

  /**
   * 유저 아이디로 유저가 존재하는지 확인합니다.
   * @param userId
   */
  async checkUserExistById(userId: number): Promise<boolean> {
    this.logger.debug(`Called ${this.checkUserExistById.name}`);
    userId;
    return true;
  }
}
