import { ApiProperty } from '@nestjs/swagger';
import { FollowUserDto } from './follow.user.dto';

/**
 * 유저의 팔로잉 또는 팔로워 목록을 반환하는 DTO입니다.
 */
export class FollowUserResponseDto {
  @ApiProperty({
    type: [FollowUserDto],
    description: '팔로잉 중인 유저 정보 배열',
  })
  follows: FollowUserDto[];

  @ApiProperty({
    example: 10,
    description: '해당 유저의 팔로잉 또는 팔로워 유저 수',
  })
  totalLength: number;
}
