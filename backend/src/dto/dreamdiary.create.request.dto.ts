import { ApiProperty } from '@nestjs/swagger';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { Optional } from '@nestjs/common';

export class DreamDiaryCreateRequestDto {
  @ApiProperty({
    example: '옥상에서 떨어지는 꿈',
    description: '꿈일기 제목',
  })
  title: string;
  @ApiProperty({
    example: [1, 2, 3],
    description: '꿈일기 카테고리 Ids',
  })
  category: number[];
  @ApiProperty({
    example: 3,
    description: '꿈 점수',
  })
  dreamScore: number;
  @ApiProperty({
    description: '꿈일기 이미지',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @Optional()
  image?: string;
  @ApiProperty({
    example: DisclosureScopeType.PUBLIC,
    description: '제한범위',
  })
  disclosureScope: DisclosureScopeType;
  @ApiProperty({
    example: '꿈일기 내용입니다.',
    description: '꿈일기 내용',
  })
  content: string;
}
