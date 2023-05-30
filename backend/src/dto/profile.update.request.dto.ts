import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 유저 프로필 수정 시 요청되는 DTO입니다.
 */
export class ProfileUpdateRequestDto {
  @ApiProperty({
    description: '이미지',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @Optional()
  imageUrl?: string;

  @ApiProperty({
    example: '닉네임1',
    description: '유저 닉네임',
    required: false,
  })
  @Optional()
  nickname?: string;

  @ApiProperty({
    example: '안녕하세요',
    description: '자기소개',
    required: false,
  })
  @Optional()
  presentation?: string;
}
