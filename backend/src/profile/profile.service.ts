import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileResponseDto } from 'src/dto/profile.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileDetailResponseDto } from 'src/dto/profile.response.dto';
import { ProfileUpdatetDto } from 'src/dto/profile.update.request.dto';
import { FollowingsResponseDto } from 'src/dto/profile.response.dto';
import { Follow } from 'src/entities/follow.entity';

/**
 * 프로필 정보와 팔로워, 팔로잉 수를 가져와 dto를 반환하는 service
 */
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly profileRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  /**
   * 팔로잉 수와 팔로워 수를 반환하는 메소드
   */
  async getProfileWithCounts(userId: number): Promise<any> {
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
   * 프로필 정보와 팔로워, 팔로잉 수가 담긴 dto를 반환하는 메소드
   */
  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const { user, followerCount, followingCount } =
      await this.getProfileWithCounts(userId);

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

  /**
   * 유저의 상세 정보가 담긴 dto 반환하는 메소드
   */
  async getProfileDetail(userId: number): Promise<ProfileDetailResponseDto> {
    const user = await this.profileRepository.findOne({
      where: { userId: userId },
    });
    const responseDto = new ProfileDetailResponseDto();

    responseDto.userId = user.userId;
    responseDto.username = user.username;
    responseDto.email = user.email;
    responseDto.nickname = user.nickname;
    responseDto.imageUrl = user.imageUrl;
    responseDto.presentation = user.presentation;
    responseDto.credits = user.credits;

    const queryBuilder = this.profileRepository.createQueryBuilder('user');

    const followerCount = await queryBuilder
      .leftJoin('user.followers', 'followers')
      .where('followers.followerId = :userId', { userId: userId })
      .getCount();

    const followingCount = await queryBuilder
      .leftJoin('user.following', 'following')
      .where('following.followingId = :userId', { userId: userId })
      .getCount();

    responseDto.followerCount = followerCount;
    responseDto.followingCount = followingCount;

    return responseDto;
  }

  /**
   * 유저의 프로필 정보(이미지,닉네임,자기소개)를
   * 업데이트 하는 메소드
   */
  async updateProfile(
    userId: number,
    profileUpdateDto: ProfileUpdatetDto,
  ): Promise<ProfileUpdatetDto> {
    const user = await this.profileRepository.findOne({
      where: { userId: userId },
    });
    if (profileUpdateDto.image) {
      const formData = profileUpdateDto.image;
      const entries = Object.fromEntries(formData.entries());
      const imageFile = entries['image'];
      // FormDataEntryValue -> Blob 변환
      const file: Blob = imageFile as any;

      // File 객체로 변환 된 경우 파일 이름 저장
      if (file instanceof File) {
        user.imageUrl = file.name;
      }
      // 파일 이름 정보가 없는 경우 임의의 이름 저장
      else {
        user.imageUrl = 'unknown';
      }
    }
    if (profileUpdateDto.nickname) {
      user.nickname = profileUpdateDto.nickname;
    }
    if (profileUpdateDto.presentation) {
      user.presentation = profileUpdateDto.presentation;
    }

    await this.profileRepository.save(user);
    return profileUpdateDto;
  }

  /**
   * 유저의 팔로잉 목록을 반환하는 메소드
   */
  async getFollowings(
    userId: string,
    currentPage: number,
    searchNickname?: string,
  ): Promise<FollowingsResponseDto> {
    //table에서 select할 column
    const select = ['user.userId', 'user.nickname', 'user.imageUrl'];
    //페이지네이션
    const take = 10;
    //skip할 페이지 수
    const skip = (currentPage - 1) * take;

    //팔로잉 목록을 가져오는 쿼리
    const followingsQuery = this.profileRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.following',
        'followings',
        'followings.followerId = :userId',
        { userId },
      )
      .select(select)
      .orderBy('user.nickname', 'ASC')
      .skip(skip)
      .take(take);

    //검색어가 있는 경우
    if (searchNickname) {
      followingsQuery.andWhere(
        'LOWER(user.nickname) like LOWER(:searchNickname)',
        {
          searchNickname: `%${searchNickname}%`,
        },
      );
    }

    const [followings, totalLength] = await followingsQuery.getManyAndCount();

    //팔로잉 목록을 담은 dto
    const followingsDto = followings.map((user) => ({
      userId: user.userId,
      nickname: user.nickname,
      imageUrl: user.imageUrl,
    }));

    //다음 페이지, 이전 페이지 존재 여부를 통해 페이지네이션에 사용
    const hasNextPage = totalLength > currentPage * take;
    const hasPrevPage = currentPage > 1;

    const responseDto: FollowingsResponseDto = {
      followings: followingsDto,
      hasNextPage,
      hasPrevPage,
    };

    return responseDto;
  }

  /**
   * 나를 팔로우 하는 사용자들의 목록을 반환하는 메소드
   */
  async getFollowers(
    userId: string,
    currentPage: number,
    searchNickname?: string,
  ): Promise<FollowingsResponseDto> {
    //table에서 select할 column
    const select = ['user.userId', 'user.nickname', 'user.imageUrl'];
    //페이지네이션
    const take = 10;
    //skip할 페이지 수
    const skip = (currentPage - 1) * take;

    //팔로워 목록을 가져오는 쿼리
    const followersQuery = this.profileRepository
      .createQueryBuilder('user')
      .innerJoin(
        'user.follower',
        'followers',
        'followers.followingId = :userId',
        { userId },
      )
      .select(select)
      .orderBy('user.nickname', 'ASC')
      .skip(skip)
      .take(take);

    //검색어가 있는 경우
    if (searchNickname) {
      followersQuery.andWhere(
        'LOWER(user.nickname) like LOWER(:searchNickname)',
        {
          searchNickname: `%${searchNickname}%`,
        },
      );
    }

    const [followers, totalLength] = await followersQuery.getManyAndCount();

    //팔로워 목록을 담은 dto
    const followersDto = followers.map((user) => ({
      userId: user.userId,
      nickname: user.nickname,
      imageUrl: user.imageUrl,
    }));

    //다음 페이지, 이전 페이지 존재 여부를 통해 페이지네이션에 사용
    const hasNextPage = totalLength > currentPage * take;
    const hasPrevPage = currentPage > 1;

    const responseDto: FollowingsResponseDto = {
      followings: followersDto,
      hasNextPage,
      hasPrevPage,
    };

    return responseDto;
  }
}
