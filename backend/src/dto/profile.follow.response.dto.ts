import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

/**
 * 유저의 팔로잉 또는 팔로워 목록을 반환하는 DTO입니다.
 */
export class FollowResponseDto {
    @ApiProperty({
      type: [UserDto],
      description: '팔로잉 중인 유저 정보 배열',
    })
    follows: UserDto[];
  
    @ApiProperty({
      example: 10,
      description: '해당 유저의 팔로잉 또는 팔로워 유저 수',
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