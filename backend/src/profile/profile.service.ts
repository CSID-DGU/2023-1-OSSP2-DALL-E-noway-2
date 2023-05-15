import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DreamDiaryFeedDto,
  DreamDiaryFeedsResponseDto,
  ProfileResponseDto,
} from 'src/dto/profile.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { User } from '../entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ProfileDetailResponseDto } from 'src/dto/profile.response.dto';
import { ProfileUpdatetDto } from 'src/dto/profile.update.request.dto';
import { FollowingsResponseDto } from 'src/dto/profile.response.dto';
import { Follow } from 'src/entities/follow.entity';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
/**
 * 프로필 정보와 팔로워, 팔로잉 수를 가져와 dto를 반환하는 service
 */
@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly profileRepository: Repository<User>,
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
  ) {}

  /**
   * 팔로잉 수와 팔로워 수를 반환하는 메소드
   * @param userId
   * @returns
   */
  async getProfileWithCounts(userId: number): Promise<any> {
    const user = await this.profileRepository.findOne({
      where: { userId: userId },
    });

    const queryBuilder = this.profileRepository.createQueryBuilder('user');

    const followerCount = await queryBuilder
      .leftJoin('Follow', 'followers', 'followers.followingId = user.userId')
      .where('followers.followerId = :userId', { userId })
      .getCount();

    const followingCount = await queryBuilder
      .leftJoin('Follow', 'following', 'following.followerId = user.userId')
      .where('following.followingId = :userId', { userId })
      .getCount();

    return {
      user,
      followerCount,
      followingCount,
    };
  }

  /**
   * 프로필 정보와 팔로워, 팔로잉 수가 담긴 dto를 반환하는 메소드
   * @param userId
   * @returns
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
   * @param userId
   * @returns
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
   * @param userId
   * @param profileUpdateDto
   * @returns
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
   * 유저의 팔로워 목록을 가져오는 메소드
   * @param userId
   * @query currentPage
   * @query length
   * @returns
   */
  async getFollowings(
    userId: string,
    currentPage: number,
    length: number,
  ): Promise<FollowingsResponseDto> {
    //table에서 select할 column
    const select = [
      'follower.userId',
      'follower.nickname',
      'follower.imageUrl',
    ];
    //페이지네이션
    const take = 10;
    //skip할 페이지 수
    const skip = (currentPage - 1) * take;

    //팔로잉 목록을 가져오는 쿼리
    const followingsQuery = this.profileRepository
      .createQueryBuilder('user')
      .innerJoin('Follow', 'follow', 'user.userId = follow.followingId')
      .innerJoin('User', 'follower', 'follow.followerId = follower.userId')
      .select(select)
      .orderBy('follower.nickname', 'ASC')
      .skip(skip)
      .take(take);

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
   * @param userId
   * @query currentPage
   * @query length
   * @query searchNickname
   * @returns
   */
  async getFollowers(
    userId: string,
    currentPage: number,
    length: number,
    searchNickname?: string,
  ): Promise<FollowingsResponseDto> {
    //table에서 select할 column
    const select = [
      'following.userId',
      'following.nickname',
      'following.imageUrl',
    ];
    //페이지네이션
    const take = 10;
    //skip할 페이지 수
    const skip = (currentPage - 1) * take;

    //팔로워 목록을 가져오는 쿼리
    const followersQuery = this.profileRepository
      .createQueryBuilder('user')
      .innerJoin('Follow', 'follow', 'user.userId = follow.followerId')
      .innerJoin('User', 'following', 'follow.followingId = following.userId')
      .select(select)
      .orderBy('follower.nickname', 'ASC')
      .skip(skip)
      .take(take);

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

  /**
   *
   *프로필에 보일 PUBLIC 및 LIMITED_PUBLIC 범위의 꿈일기를 확인하고 반환하는 메소드
   * @param userId
   * @param loggedInUserId
   * @returns
   */
  async getDreamDiariesByUserId(
    userId: number,
    loggedInUserId: number,
    currentPage: number,
    length: number = 10, // 한 페이지에 보여질 게시물 수, 기본값은 10
  ): Promise<DreamDiaryFeedsResponseDto> {
    const take = length; // 한 페이지에 보여질 게시물 수
    const skip = (currentPage - 1) * length; // 건너뛸 게시물 수

    const query = this.dreamDiaryRepository
      .createQueryBuilder('DreamDiary')
      .leftJoin('DreamDiary.author', 'author')
      .where('DreamDiary.userId = :userId', { userId })
      .andWhere('DreamDiary.disclosureScope = :public', {
        public: DisclosureScopeType.PUBLIC,
      });

    query.leftJoinAndSelect(
      'author.follower',
      'follower',
      'follower.userId = :loggedInUserId',
      {
        loggedInUserId,
      },
    );

    query.andWhere(
      new Brackets((q) => {
        q.where('DreamDiary.disclosureScope = :public', {
          public: DisclosureScopeType.PUBLIC,
        });
        q.orWhere(
          'DreamDiary.disclosureScope = :limitedPublic AND (author.userId = :loggedInUserId OR follower.userId = :loggedInUserId)',
          {
            limitedPublic: DisclosureScopeType.LIMITED_PUBLIC,
            loggedInUserId,
          },
        );
      }),
    );

    const [dreamDiaries, totalCount] = await query
      .orderBy('DreamDiary.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .select([
        'DreamDiary.diaryId as diaryId',
        'DreamDiary.title as title',
        'DreamDiary.imageUrl as imageUrl',
        'DreamDiary.viewCount as viewCount',
        'author.nickname as nickname',
      ])
      .getRawMany();

    const dreamDiaryFeeds = dreamDiaries.map((dreamDiary) => {
      const { diaryId, title, viewCount, nickname, imageUrls } = dreamDiary;
      const diaryImageUrl = imageUrls ? imageUrls[0] : null;

      return {
        diaryId,
        title,
        viewCount,
        nickname,
        diaryImageUrl,
      };
    });

    const totalPages = Math.ceil(totalCount / length); // 전체 페이지 수
    const hasNextPage = currentPage < totalPages; // 다음 페이지가 있는지 여부
    const hasPrevPage = currentPage > 1; // 이전 페이지가 있는지 여부

    return {
      dreamDiaryFeeds,
      totalLength: totalCount,
      hasNextPage,
      hasPrevPage,
    };
  }
}
