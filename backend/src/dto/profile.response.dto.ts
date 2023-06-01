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
