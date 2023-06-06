import { UserDto } from 'src/dto/user.dto';
import { SocialProfile } from 'src/type/social.profile';

/**
 * UserService에 대한 인터페이스입니다.
 * 개발 단계에서만 사용합니다.
 */
export interface IUserService {
  /**
   * SocialProfile을 받아서 유저를 생성하거나, 유저가 존재하면 유저 정보를 반환합니다.
   * TODO: 추후 UserService에서 실제 구현이 필요합니다.
   * @param profile
   */
  findOrCreateUserBySocialProfile(profile: SocialProfile): Promise<UserDto>;

  /**
   * 유저 아이디로 유저가 존재하는지 확인합니다.
   * TODO: 추후 UserService에서 실제 구현이 필요합니다.
   * @param userId
   */
  checkUserExistById(userId: number): Promise<boolean>;
}
