import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileResponseDto } from 'src/dto/profile.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

/**
 * getProfileWithCounts 메소드를 사용하여
 * 프로필 정보와 팔로워, 팔로잉 수를 가져와 dto를 반환하는 service
 */
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly profileRepository: Repository<User>,
  ) {}

  /**
   * 팔로잉 수와 팔로워 수를
   */
  async getCounts(userId: number): Promise<any> {
    const user = await this.profileRepository.findOne({
      where: { userId: userId },
    });

    const queryBuilder = this.profileRepository.createQueryBuilder('user');

    const followerCount = await queryBuilder
      .leftJoin('follows', 'followers', 'followers.following_id = user.user_id')
      .where('followers.follower_id = :userId', { userId })
      .getCount();

    const followingCount = await queryBuilder
      .leftJoin('follows', 'following', 'following.follower_id = user.user_id')
      .where('following.following_id = :userId', { userId })
      .getCount();

    return {
      user,
      followerCount,
      followingCount,
    };
  }

  /**
   * getProfileWithCounts 메소드를 사용하여
   * 프로필 정보와 팔로워, 팔로잉 수를 가져와 dto를 반환하는 service
   */
  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const { user, followerCount, followingCount } = await this.getCounts(
      userId,
    );

    const userDto = new UserDto();
    userDto.userId = user.userId;
    userDto.nickname = user.nickname;
    userDto.imageUrl = user.imageUrl;

    const responseDto = new ProfileResponseDto();
    responseDto.user = userDto;
    responseDto.followerCount = followerCount;
    responseDto.followingCount = followingCount;

    return responseDto;
  }
}
