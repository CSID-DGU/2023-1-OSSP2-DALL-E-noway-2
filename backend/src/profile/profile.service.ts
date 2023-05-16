import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DreamDiaryFeedsResponseDto,
  FollowResponseDto,
  ProfileResponseDto,
  BoardListResponseDto,
} from 'src/dto/profile.response.dto';
import { UserDto } from 'src/dto/user.dto';
import { User } from '../entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ProfileDetailResponseDto } from 'src/dto/profile.response.dto';
import { ProfileUpdateRequestDto } from 'src/dto/profile.request.dto';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { Follow } from 'src/entities/follow.entity';
import { Board } from 'src/entities/board.entity';
import { BoardType } from 'src/enum/board.type';
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
    userId: number,
    profileUpdateDto: ProfileUpdateRequestDto,
    authorizedUserId: number,
  ): Promise<ProfileUpdateRequestDto> {
    if (userId === authorizedUserId) {
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
    } else {
      throw new UnauthorizedException();
    }
  }

  /**
   * 유저의 팔로잉 목록을 반환하는 메소드
   * @param userId
   * @query currentPage
   * @returns
   */
  async getFollowings(
    userId: number,
    currentPage: number,
  ): Promise<FollowResponseDto> {
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
    const rest = totalLength % 10;
    const lastTake =
      currentPage === Math.ceil(totalLength / 10)
        ? rest > 0
          ? rest
          : 10
        : take;

    const followers = await followersQuery.take(lastTake).getMany();

    const followersDto = followers.map((follow) => ({
      userId: follow.follower.userId,
      nickname: follow.follower.nickname,
      imageUrl: follow.follower.imageUrl,
    }));

    //다음 페이지, 이전 페이지 존재 여부를 통해 페이지네이션에 사용
    const hasNextPage = totalLength > currentPage * take;
    const hasPrevPage = currentPage > 1;

    const responseDto: FollowResponseDto = {
      follows: followersDto,
      hasNextPage,
      hasPrevPage,
    };

    return responseDto;
  }

  /**
   * 유저의 팔로워 목록을 반환하는 메소드
   * @param userId
   * @query currentPage
   * @returns
   */
  async getFollowers(
    userId: number,
    currentPage: number,
  ): Promise<FollowResponseDto> {
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
    const rest = totalLength % 10;
    const lastTake =
      currentPage === Math.ceil(totalLength / 10)
        ? rest > 0
          ? rest
          : 10
        : take;

    const followings = await followingsQuery.take(lastTake).getMany();

    const followersDto = followings.map((follow) => ({
      userId: follow.following.userId,
      nickname: follow.following.nickname,
      imageUrl: follow.following.imageUrl,
    }));

    //다음 페이지, 이전 페이지 존재 여부를 통해 페이지네이션에 사용
    const hasNextPage = totalLength > currentPage * take;
    const hasPrevPage = currentPage > 1;

    const responseDto: FollowResponseDto = {
      follows: followersDto,
      hasNextPage,
      hasPrevPage,
    };

    return responseDto;
  }

  /**
   *
   *프로필에 보일 PUBLIC 범위의 꿈일기를 확인하고 반환하는 메소드
   * @param userId
   * @query currentPage
   * @returns
   */
  async getFeeds(
    userId: number,
    currentPage: number,
    authorizedUserId: number,
  ): Promise<DreamDiaryFeedsResponseDto> {
    const take = 10; // 한 페이지에 보여질 게시물 수
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

    const hasNextPage = currentPage < totalPages; // 다음 페이지가 있는지 여부
    const hasPrevPage = currentPage > 1; // 이전 페이지가 있는지 여부

    return {
      dreamDiaryFeeds,
      totalLength: totalCount,
      hasNextPage,
      hasPrevPage,
    };
  }
  /**
   *프로필에서 post-type에 따라 조회되는 게시물을 반환하는 메소드
   * @param userId
   * @param postType
   * @param currentPage
   * @param authorizedUserId
   * @returns
   */
  async getBoardList(
    userId: number,
    postType: string,
    currentPage: number,
    authorizedUserId: number,
  ): Promise<BoardListResponseDto> {
    const take = 10;
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

    const hasNextPage = currentPage < totalPages; // 다음 페이지가 있는지 여부
    const hasPrevPage = currentPage > 1; // 이전 페이지가 있는지 여부

    return {
      boardList,
      totalLength: totalCount,
      hasNextPage,
      hasPrevPage,
    };
  }
}
