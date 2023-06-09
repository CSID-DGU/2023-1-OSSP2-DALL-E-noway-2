import { ApiProperty } from '@nestjs/swagger';

export class DreamScoreAverageResponseDto {
  @ApiProperty({ example: 4.5, description: '나의 꿈 일기 평균 점수' })
  myAvgScore: number;

  @ApiProperty({
    example: 4.5,
    description: '다른 사용자들의 꿈 일기 평균 점수',
  })
  othersAvgScore: number;
}
