import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

/**
 * @description
 * 팔로우 유저 정보와 팔로우 여부를 담는 DTO입니다.
 *
 * @see {@link UserDto}
 * @see {@link FollowUser}
 */
export class FollowUserDto extends UserDto {
  @ApiProperty({
    example: true,
    description: '해당 유저를 팔로우 중인지 여부',
  })
  isFollowed: boolean;
}
