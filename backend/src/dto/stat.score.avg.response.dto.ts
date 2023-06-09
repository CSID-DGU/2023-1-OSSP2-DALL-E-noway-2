import { ApiProperty } from '@nestjs/swagger';

export class DreamDiaryCategoryScoreAvg {
  @ApiProperty({ example: 1, description: '카테고리 ID' })
  categoryId: number;

  @ApiProperty({
    example: '악몽',
    description: '카테고리 이름',
  })
  categoryName: string;

  @ApiProperty({ example: 4.5, description: '평균 점수' })
  scoreAvg: number;
}
