import { ApiProperty } from '@nestjs/swagger';

/**
 * 유저 프로필 수정 시 요청되는 DTO입니다.
 */
export class ProfileUpdatetDto {
  @ApiProperty({
    example: 'formData',
    description: '프로필 이미지',
  })
  image?: FormData;

  @ApiProperty({
    example: '닉네임1',
    description: '유저 닉네임',
  })
  nickname?: string;

  @ApiProperty({
    example: '안녕하세요',
    description: '자기소개',
  })
  presentation?: string;
}
