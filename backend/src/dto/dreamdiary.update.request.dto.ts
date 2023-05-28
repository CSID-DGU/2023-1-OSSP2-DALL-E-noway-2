import { ApiProperty } from '@nestjs/swagger';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';

export class DreamDiaryUpdateRequestDto {
  @ApiProperty({
    example: '무서운 꿈',
    description: '꿈일기 제목',
  })
  title: string;
  @ApiProperty({
    example: [1, 2],
    description: '카테고리 Ids',
  })
  category: number[];
  @ApiProperty({
    example: 1,
    description: '꿈 점수',
  })
  dreamScore: number;
  @ApiProperty({
    example: 'formData',
    description: '꿈일기 이미지',
  })
  imageUrl?: FormData;
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
