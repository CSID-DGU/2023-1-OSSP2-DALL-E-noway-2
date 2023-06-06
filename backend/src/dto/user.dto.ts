import { ApiProperty } from '@nestjs/swagger';

/**
 * 유저 정보를 담는 DTO입니다.
 * jwt 토큰에 담기는 정보와 동일합니다.
 */
export class UserDto {
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
}
