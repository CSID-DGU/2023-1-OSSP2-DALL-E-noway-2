import { ApiProperty } from '@nestjs/swagger';
import { CalendarDayInfoDto } from './calendar.day.info.dto';

export class CalendarListResponseDto {
  @ApiProperty({
    example: 2023,
    description: '년도',
  })
  year: number;

  @ApiProperty({
    example: 6,
    description: '월',
  })
  month: number;

  @ApiProperty({
    example: [
      {
        day: 1,
        diaryId: 2,
        dreamScore: 2,
      },
      {
        day: 2,
        diaryId: 3,
        dreamScore: 3,
      },
    ],
    description: '일 별 정보',
  })
  days: CalendarDayInfoDto[];
}
