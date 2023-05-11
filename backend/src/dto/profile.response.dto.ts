import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

// 유저 프로필 요청 성공 시 반환되는 DTO 입니다.
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
  followingCount: number;
}
