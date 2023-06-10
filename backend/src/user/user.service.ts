import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { ImageRequests } from 'src/entities/image.requests.entity';
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
    @InjectRepository(ImageRequests)
    private readonly imageRequestsRepository: Repository<ImageRequests>,
  ) {}
  /**
   * SocialProfile을 받아서 유저를 생성하거나, 유저가 존재하면 유저 정보를 반환합니다.
   * User와 OAuth 테이블에 저장하는 작업은 하나의 트랜잭션으로 처리합니다.
   * NOTE: nicname은 임시로 uuid로 할당합니다.
   * @param profile
   */
  async findOrCreateUserBySocialProfile(
    profile: SocialProfile,
  ): Promise<[UserDto, boolean]> {
    this.logger.debug(`Called ${this.findOrCreateUserBySocialProfile.name}`);
    const find = await this.userRepository.findOne({
      where: {
        email: profile.email,
      },
    });
    if (find) {
      return [
        {
          userId: find.userId,
          nickname: find.nickname,
          imageUrl: find.imageUrl,
        },
        false,
      ];
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

    return [
      {
        userId: result.identifiers[0].userId,
        nickname: user.nickname,
        imageUrl: user.imageUrl,
      },
      true,
    ];
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

  async getUserWithImageRequestsInfo(userId: number): Promise<User> {
    this.logger.debug(`Called ${this.getUserWithImageRequestsInfo.name}`);

    const result = await this.userRepository.findOne({
      where: {
        userId,
      },
      relations: ['imageRequests'],
    });
    return result;
  }

  /**
   * 유저의 현재 이미지 요청 횟수를 업데이트합니다.
   * @param userId
   * @param curRequestCount
   */
  async updateUserCurRequestCount(
    userId: number,
    curRequestCount: number,
  ): Promise<void> {
    this.logger.debug(`Called ${this.updateUserCurRequestCount.name}`);
    await this.imageRequestsRepository
      .createQueryBuilder()
      .update()
      .set({
        curRequestCount,
      })
      .where({
        userId,
      })
      .execute();
  }

  /**
   * 유저의 크레딧 수를 업데이트합니다.
   * @param userId
   * @param credits
   */
  async updateUserCredits(userId: number, credits: number): Promise<void> {
    this.logger.debug(`Called ${this.updateUserCredits.name}`);
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({
        credits,
      })
      .where({
        userId,
      })
      .execute();
  }

  /**
   * 모든 유저의 이미지 요청 횟수를 초기화합니다.
   */
  async resetAllUserImageRequests(): Promise<void> {
    this.logger.debug(`Called ${this.resetAllUserImageRequests.name}`);

    await this.imageRequestsRepository
      .createQueryBuilder()
      .update()
      .set({
        curRequestCount: 0,
      })
      .execute();
  }

  async getUserInfo(userId: number): Promise<UserDto> {
    this.logger.debug(`Called ${this.getUserInfo.name}`);

    const user = await this.userRepository.findOne({
      where: {
        userId,
      },
    });

    return {
      userId: user.userId,
      nickname: user.nickname,
      imageUrl: user.imageUrl,
    };
  }
}
