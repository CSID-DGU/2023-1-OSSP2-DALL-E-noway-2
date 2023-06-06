import { ApiProperty } from '@nestjs/swagger';

export class CalendarDayInfoDto {
  @ApiProperty({
    example: 5,
    description: '일',
    required: true,
  })
  day: number;

  @ApiProperty({
    example: 1,
    description: '꿈일기 ID',
  })
  diaryId: number | null;

  @ApiProperty({
    example: 5,
    description: '꿈점수',
    required: true,
  })
  dreamScore: number;
}
