import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { OAuth } from 'src/entities/oauth.entity';
import { User } from 'src/entities/user.entity';
import { ProviderType } from 'src/enum/provider.type';
import { SocialProfile } from 'src/type/social.profile';
import { InsertResult, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  /**
   * SocialProfile을 받아서 유저를 생성하거나, 유저가 존재하면 유저 정보를 반환합니다.
   * User와 OAuth 테이블에 저장하는 작업은 하나의 트랜잭션으로 처리합니다.
   * NOTE: nicname은 임시로 uuid로 할당합니다.
   * @param profile
   */
  async findOrCreateUserBySocialProfile(
    profile: SocialProfile,
  ): Promise<UserDto> {
    this.logger.debug(`Called ${this.findOrCreateUserBySocialProfile.name}`);
    const find = await this.userRepository.findOne({
      where: {
        email: profile.email,
      },
    });
    if (find) {
      return {
        userId: find.userId,
        nickname: find.nickname,
        imageUrl: find.imageUrl,
      };
    }

    let provider: ProviderType;
    switch (profile.provider) {
      case 'naver':
        provider = ProviderType.NAVER;
        break;
      case 'kakao':
        provider = ProviderType.KAKAO;
        break;
      case 'google':
        provider = ProviderType.GOOGLE;
        break;
    }

    const user = new User();
    user.nickname = uuid();
    user.imageUrl = profile.imageUrl;
    user.username = profile.username;
    user.email = profile.email;
    user.presentation = null;

    let result: InsertResult;
    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        result = await transactionalEntityManager
          .getRepository(User)
          .insert(user);

        await transactionalEntityManager.getRepository(OAuth).insert({
          userId: result.identifiers[0].userId,
          oauthId: profile.oauthId,
          accessToken: null,
          provider: provider,
        });
      },
    );

    return {
      userId: result.identifiers[0].id,
      nickname: user.nickname,
      imageUrl: user.imageUrl,
    };
  }

  /**
   * 유저 아이디로 유저가 존재하는지 확인합니다.
   * @param userId
   */
  async checkUserExistById(userId: number): Promise<boolean> {
    this.logger.debug(`Called ${this.checkUserExistById.name}`);
    const user = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
    return user ? true : false;
  }
}
