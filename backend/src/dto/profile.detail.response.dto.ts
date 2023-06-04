import { ApiProperty } from '@nestjs/swagger';

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
