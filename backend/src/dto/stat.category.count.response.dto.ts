import { ApiProperty } from '@nestjs/swagger';

/**
 * 꿈 일기 카테고리별 통계를 담는 DTO입니다.
 */
export class DreamDiaryCategoryCount {
  @ApiProperty({
    example: 1,
    description: '카테고리 아이디',
  })
  categoryId: number;

  @ApiProperty({
    example: '악몽',
    description: '카테고리 이름',
  })
  categoryName: string;

  @ApiProperty({
    example: 1,
    description: '카테고리별 꿈 일기 개수',
  })
  count: number;
}
