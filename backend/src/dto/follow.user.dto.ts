import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
/**
 * 팔로우 유저 정보와 팔로우 여부를 담는 DTO입니다.
 */
export class FollowUserDto {
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
    example: true,
    description: '해당 유저를 팔로우 중인지 여부',
  })
  isFollowed: boolean;
}
