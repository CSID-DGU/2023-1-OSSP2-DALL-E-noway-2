import { ApiProperty } from '@nestjs/swagger';

export class commentUserResponseDto {
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
    description: '유저 프로필 이미지 URL',
  })
  imageUrl: string;
}
