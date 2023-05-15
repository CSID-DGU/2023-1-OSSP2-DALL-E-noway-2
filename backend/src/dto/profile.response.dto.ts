import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

/**
 * user 프로필 조회시 반환되는 DTO들을 모아놓은 파일입니다.
 */

/**
 * 유저 프로필 조회 시 반환되는 DTO입니다.
 */
export class ProfileResponseDto {
  @ApiProperty({
    example: {
      userId: 1,
      nickname: '닉네임1',
      imageUrl: 'https://example.com',
    },
  })
  user: UserDto;

  @ApiProperty({
    example: 1,
    description: '팔로워 수',
  })
  followerCount: number;

  @ApiProperty({
    example: 1,
    description: '팔로잉 수',
  })
  followingCount: number;
}

/**
 * 유저 프로필 상세 정보를 담는 DTO입니다.
 */
export class ProfileDetailResponseDto {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  userId: number;

  @ApiProperty({
    example: '닉네임1',
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 'https://example.com',
    description: '유저 프로필 이미지 URL',
  })
  imageUrl: string;

  @ApiProperty({
    example: 'abcd@naver.com',
    description: '유저 이메일',
  })
  email: string;

  @ApiProperty({
    example: '홍길동',
    description: '유저 이름',
  })
  username: string;

  @ApiProperty({
    example: '안녕하세요',
    description: '자기소개',
  })
  presentation: string;

  @ApiProperty({
    example: 3,
    description: '보유 크레딧',
  })
  credits: number;

  @ApiProperty({
    example: 1,
    description: '팔로워 수',
  })
  followerCount: number;

  @ApiProperty({
    example: 1,
    description: '팔로잉 수',
  })
  followingCount: number;
}

/**
 * 유저의 팔로잉 목록을 반환하는 DTO입니다.
 */
export class FollowingsResponseDto {
  @ApiProperty({
    type: [UserDto],
    description: '팔로잉 중인 유저 정보 배열',
  })
  followings: UserDto[];

  @ApiProperty({
    example: true,
    description: '다음 페이지 존재 여부',
  })
  hasNextPage: boolean;

  @ApiProperty({
    example: true,
    description: '이전 페이지 존재 여부',
  })
  hasPrevPage: boolean;
}

/**
 * 피드에 표시될 다이어리의 정보를 반환하는 DTO입니다.
 */
export class DreamDiaryFeedDto {
  @ApiProperty({
    example: 1,
    description: '다이어리 아이디',
  })
  diaryId: number;

  @ApiProperty({
    example: '다이어리 제목',
    description: '다이어리 제목',
  })
  title: string;

  @ApiProperty({
    example: '2021-01-01',
    description: '다이어리 생성 날짜',
  })
  viewCount: number;

  @ApiProperty({
    example: '닉네임1',
    description: '유저 닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: 'https://example.com',
    description: '유저 프로필 이미지 URL',
  })
  diaryImageUrl: string;
}

/**
 * 프로필에 표시될 유저의 PUBLIC 또는 LIMITED_PUBLIC 범위의 다이어리 목록를 반환하는 DTO입니다.
 */
export class DreamDiaryFeedsResponseDto {
  @ApiProperty({
    type: [DreamDiaryFeedDto],
    description: '다이어리 목록',
  })
  dreamDiaryFeeds: DreamDiaryFeedDto[];

  @ApiProperty({
    example: 10,
    description: '다이어리 목록의 총 길이',
  })
  totalLength: number;

  @ApiProperty({
    example: true,
    description: '다음 페이지 존재 여부',
  })
  hasNextPage: boolean;

  @ApiProperty({
    example: true,
    description: '이전 페이지 존재 여부',
  })
  hasPrevPage: boolean;
}
