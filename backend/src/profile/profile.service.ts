import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileResponseDto } from 'src/dto/profile.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { User } from '../entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { Follow } from 'src/entities/follow.entity';
import { Board } from 'src/entities/board.entity';
import { BoardType } from 'src/enum/board.type';
import { ProfileDetailResponseDto } from 'src/dto/profile.detail.response.dto';
import { FollowResponseDto } from 'src/dto/profile.follow.response.dto';
import { DreamDiaryFeedResponseDto } from 'src/dto/profile.feed.response.dto';
import { BoardListResponseDto } from 'src/dto/profile.boardlist.response.dto';
import { FollowUserDto } from 'src/dto/follow.user.dto';

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
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
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

    const queryBuilder = this.followRepository.createQueryBuilder('follow');

    const followerCount = await queryBuilder
      .leftJoin('follow.following', 'following')
      .where('following.userId = :userId', { userId: userId })
      .getCount();

    const followingCount = await queryBuilder
      .leftJoin('follow.follower', 'follower')
      .where('follower.userId = :userId', { userId: userId })
      .getCount();

    responseDto.followerCount = followerCount;
    responseDto.followingCount = followingCount;

    return responseDto;
  }

  /**
   * 유저의 프로필 정보(이미지,닉네임,자기소개)를
   * 업데이트 하는 메소드
   * @param userId
   * @param profileUpdateRequestDto
   * @returns
   */
  async updateProfile(
    authorizedUserId: number,
    nickname?: string,
    presentation?: string,
    imageUrl?: string,
  ): Promise<User> {
    const user = await this.profileRepository.findOne({
      where: { userId: authorizedUserId },
    });
    if (imageUrl) {
      user.imageUrl = imageUrl;
    }
    if (nickname) {
      user.nickname = nickname;
    }
    if (presentation) {
      user.presentation = presentation;
    }

    await this.profileRepository.save(user);
    return user;
  }

  /**
   * 유저의 팔로잉 목록을 반환하는 메소드
   * @param userId
   * @query currentPage
   * @query length
   * @returns
   */
  async getFollowings(
    userId: number,
    currentPage: number,
    length: number,
  ): Promise<FollowResponseDto> {
    //table에서 select할 column
    const select = [
      'follower.userId',
      'follower.nickname',
      'follower.imageUrl',
    ];
    //페이지네이션
    const take = length;
    //skip할 페이지 수
    const skip = (currentPage - 1) * take;

    const followersQuery = this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .innerJoin('follow.following', 'following')
      .where('following.userId = :userId', { userId: userId })
      .addSelect(select)
      .orderBy('follow.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    // 마지막 페이지일 때 보여질 개수
    const totalLength = await followersQuery.getCount();
    const rest = totalLength % take;
    const lastTake =
      currentPage === Math.ceil(totalLength / take)
        ? rest > 0
          ? rest
          : length
        : take;

    const followers = await followersQuery.take(lastTake).getMany();

    const followersDto = followers.map((follow) => ({
      userId: follow.follower.userId,
      nickname: follow.follower.nickname,
      imageUrl: follow.follower.imageUrl,
    }));

    const responseDto: FollowResponseDto = {
      follows: followersDto,
      totalLength,
    };

    return responseDto;
  }

  /**
   * 유저의 팔로워 목록을 반환하는 메소드
   * @param userId
   * @query currentPage
   * @query length
   * @returns
   */
  async getFollowers(
    userId: number,
    currentPage: number,
    length: number,
  ): Promise<FollowResponseDto> {
    //table에서 select할 column
    const select = [
      'following.userId',
      'following.nickname',
      'following.imageUrl',
    ];
    //페이지네이션
    const take = length;
    //skip할 페이지 수
    const skip = (currentPage - 1) * take;

    const followingsQuery = this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('follow.following', 'following')
      .innerJoin('follow.follower', 'follower')
      .where('follower.userId = :userId', { userId: userId })
      .addSelect(select)
      .orderBy('follow.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    // 마지막 페이지일 때 보여질 개수
    const totalLength = await followingsQuery.getCount();
    const rest = totalLength % take;
    const lastTake =
      currentPage === Math.ceil(totalLength / take)
        ? rest > 0
          ? rest
          : take
        : take;

    const followings = await followingsQuery.take(lastTake).getMany();

    const followersDto = followings.map((follow) => ({
      userId: follow.following.userId,
      nickname: follow.following.nickname,
      imageUrl: follow.following.imageUrl,
    }));

    const responseDto: FollowResponseDto = {
      follows: followersDto,
      totalLength,
    };

    return responseDto;
  }

  /**
   *
   *프로필에 보일 PUBLIC 범위의 꿈일기를 확인하고 반환하는 메소드
   * @param userId
   * @query currentPage
   * @query length
   * @returns
   */
  async getFeeds(
    userId: number,
    currentPage: number,
    length: number,
    authorizedUserId: number,
  ): Promise<DreamDiaryFeedResponseDto> {
    const take = length; // 한 페이지에 보여질 게시물 수
    const skip = (currentPage - 1) * take; // 건너뛸 게시물 수

    const query = this.dreamDiaryRepository
      .createQueryBuilder('dream_diary')
      .leftJoinAndSelect('dream_diary.author', 'author')
      .where('dream_diary.userId = :userId', { userId })
      .andWhere('dream_diary.disclosureScope = :PUBLIC', {
        PUBLIC: DisclosureScopeType.PUBLIC,
      });

    query.andWhere(
      new Brackets((q) => {
        q.where('dream_diary.disclosureScope = :PUBLIC', {
          PUBLIC: DisclosureScopeType.PUBLIC,
        });
        q.orWhere('author.userId = :authorizedUserId', {
          authorizedUserId,
        });
      }),
    );

    const totalCount = await query.getCount(); //전체 게시물 수
    const totalPages = Math.ceil(totalCount / take); // 전체 페이지 수
    const lastPageRemainder = totalCount % take;
    const lastPageCount = lastPageRemainder === 0 ? take : lastPageRemainder;

    const dreamDiaries = await query
      .orderBy('dream_diary.createdAt', 'DESC')
      .skip(skip)
      .take(currentPage === totalPages ? lastPageCount : take)
      .getMany();

    const dreamDiaryFeeds = dreamDiaries.map((dreamDiary) => {
      const { diaryId, title, viewCount, author, imageUrl } = dreamDiary;
      const diaryImageUrl = imageUrl ? imageUrl : null;
      const { nickname } = author;

      return {
        diaryId,
        title,
        viewCount,
        nickname,
        diaryImageUrl,
      };
    });

    return {
      dreamDiaryFeeds,
      totalLength: totalCount,
    };
  }
  /**
   *프로필에서 post-type에 따라 조회되는 게시물을 반환하는 메소드
   * @param userId
   * @param postType
   * @query currentPage
   * @query length
   * @param authorizedUserId
   * @returns
   */
  async getBoardList(
    userId: number,
    postType: string,
    currentPage: number,
    length: number,
    authorizedUserId: number,
  ): Promise<BoardListResponseDto> {
    const take = length;
    const skip = (currentPage - 1) * take;

    const query = this.boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.author', 'author')
      .where('board.userId = :userId', { userId });

    if (postType === 'FREE') {
      query.andWhere('board.boardType = :FREE', { FREE: BoardType.FREE });
    } else if (postType === 'TIP') {
      query.andWhere('board.boardType = :TIP', { TIP: BoardType.TIP });
    } else if (postType === 'REQUEST') {
      query.andWhere('board.boardType = :REQUEST', {
        REQUEST: BoardType.REQUEST,
      });
    } else {
      throw new BadRequestException('존재하지 않는 게시판입니다.');
    }

    query.andWhere('board.disclosureScope = :PUBLIC', {
      PUBLIC: DisclosureScopeType.PUBLIC,
    });

    query.andWhere(
      new Brackets((q) => {
        q.where('board.disclosureScope = :PUBLIC', {
          PUBLIC: DisclosureScopeType.PUBLIC,
        }).andWhere('board.boardType = :type', { type: postType });
        q.orWhere('author.userId = :authorizedUserId', {
          authorizedUserId,
        });
      }),
    );

    const totalCount = await query.getCount(); //전체 게시글 수
    const totalPages = Math.ceil(totalCount / take); // 전체 페이지 수
    const lastPageRemainder = totalCount % take;
    const lastPageCount = lastPageRemainder === 0 ? take : lastPageRemainder;

    const boards = await query
      .orderBy('board.createdAt', 'DESC')
      .skip(skip)
      .take(currentPage === totalPages ? lastPageCount : take)
      .getMany();

    const boardList = boards.map((board) => {
      const { postId, title, viewCount, author, imageUrl } = board;
      const boardImageUrl = imageUrl ? imageUrl : null;
      const { nickname } = author;

      return {
        postId,
        title,
        viewCount,
        nickname,
        boardImageUrl,
      };
    });

    return {
      boardList,
      totalLength: totalCount,
    };
  }

  /**
   * 유저를 팔로우하는 메소드
   * @param authorizedUserId
   * @param userId
   * @returns
   */
  async followUser(
    authorizedUserId: number,
    followingId: number,
  ): Promise<void> {
    const existingFollow = await this.followRepository.findOne({
      where: {
        followerId: authorizedUserId,
        followingId: followingId,
      },
    });

    if (!existingFollow) {
      const newFollow = new Follow();
      newFollow.followerId = authorizedUserId;
      newFollow.followingId = followingId;
      newFollow.createdAt = new Date();
      await this.followRepository.save(newFollow);
    }
  }

  /**
   * 유저를 팔로우 취소하는 메소드
   * @param authorizedUserId
   * @param followingId
   * @returns
   */
  async unFollowUser(
    authorizedUserId: number,
    followingId: number,
  ): Promise<void> {
    const existingFollow = await this.followRepository.findOne({
      where: {
        followerId: authorizedUserId,
        followingId: followingId,
      },
    });

    if (existingFollow) {
      await this.followRepository.delete(existingFollow);
    }
  }

  /**
   * 다른 유저 팔로잉 목록에서
   * 유저를 팔로우하는지 여부와
   * 유저 정보를 반환하는 메소드
   * @param userId
   * @param authorizedUserId
   */
  async getFollowingInfo(
    userId: number,
    authorizedUserId: number,
  ): Promise<FollowUserDto[]> {
    const select = [
      'follower.userId',
      'follower.nickname',
      'follower.imageUrl',
    ];

    //팔로잉 목록 쿼리
    const followersQuery = this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .innerJoin('follow.following', 'following')
      .where('following.userId = :userId', { userId: userId })
      .addSelect(select);

    const followers = await followersQuery.getMany();

    const followersDto = followers.map((follow) => ({
      userId: follow.follower.userId,
      nickname: follow.follower.nickname,
      imageUrl: follow.follower.imageUrl,
    }));

    //각 팔로잉 목록 유저에 대해 로그인한 유저가 팔로우 중인지 여부 확인
    const responseDtoPromises: Promise<FollowUserDto>[] = followersDto
      .filter((follower) => follower.userId !== authorizedUserId) //본인 제외
      .map(async (follower) => {
        // 로그인한 유저의 팔로우 여부 확인
        const existingFollow = await this.followRepository.findOne({
          where: {
            followerId: follower.userId,
            followingId: authorizedUserId,
          },
        });
        const isFollowed = existingFollow ? true : false;
        return {
          userId: follower.userId,
          nickname: follower.nickname,
          imageUrl: follower.imageUrl,
          isFollowed: isFollowed,
        };
      });

    const responseDto: FollowUserDto[] = await Promise.all(responseDtoPromises);

    return responseDto;
  }

  /**
   * 다른 유저 팔로워 목록에서
   * 유저를 팔로우하는지 여부와
   * 유저 정보를 반환하는 메소드
   * @param userId
   * @param authorizedUserId
   */
  async getFollowerInfo(
    userId: number,
    authorizedUserId: number,
  ): Promise<FollowUserDto[]> {
    const select = [
      'following.userId',
      'following.nickname',
      'following.imageUrl',
    ];

    //팔로워 목록 쿼리
    const followingsQuery = this.followRepository
      .createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .innerJoin('follow.following', 'following')
      .where('follower.userId = :userId', { userId: userId })
      .addSelect(select);

    const followings = await followingsQuery.getMany();

    const followingsDto = followings.map((follow) => ({
      userId: follow.following.userId,
      nickname: follow.following.nickname,
      imageUrl: follow.following.imageUrl,
    }));

    //각 팔로워에 대해 로그인한 유저가 팔로우 중인지 여부 확인
    const responseDtoPromises: Promise<FollowUserDto>[] = followingsDto
      .filter((following) => following.userId !== authorizedUserId) //본인 제외
      .map(async (following) => {
        // 로그인한 유저의 팔로우 여부 확인
        const existingFollow = await this.followRepository.findOne({
          where: {
            followerId: following.userId,
            followingId: authorizedUserId,
          },
        });
        const isFollowed = existingFollow ? true : false;
        return {
          userId: following.userId,
          nickname: following.nickname,
          imageUrl: following.imageUrl,
          isFollowed: isFollowed,
        };
      });

    const responseDto: FollowUserDto[] = await Promise.all(responseDtoPromises);

    return responseDto;
  }
}
