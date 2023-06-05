import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarDayInfoDto } from 'src/dto/calendar.day.info.dto';
import { CalendarListResponseDto } from 'src/dto/calendar.list.response.dto';
import { DreamDiaryFeedDto } from 'src/dto/dreamdiary.feeds.response.dto';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
  ) {}

  async getMonthDiaryList(
    userId: number,
    year: number,
    month: number,
  ): Promise<CalendarListResponseDto> {
    this.logger.debug(`Called ${CalendarService.name}`);
    const dreamDiaries = await this.dreamDiaryRepository.find({
      where: {
        userId: userId,
        createdAt: Between(
          new Date(year, month - 1, 1),
          new Date(year, month, 1),
        ),
      },
    });
    const calendarListResponseDto = {
      year: year,
      month: month,
      // 1~31일까지 값을 채움, 없으면 diaryId를 null로 설정.
      days: Array.from({ length: 31 }, (_, i) => {
        const diary = dreamDiaries.find(
          (diary) => diary.createdAt.getDate() === i + 1,
        );
        return {
          day: i + 1,
          diaryId: diary ? diary.diaryId : null,
          dreamScore: diary ? diary.dreamScore : 0,
        } as CalendarDayInfoDto;
      }),
    };
    return calendarListResponseDto;
  }

  async getDreamDiaryFeedByDate(
    userId: number,
    year: number,
    month: number,
    day: number,
  ): Promise<DreamDiaryFeedDto> {
    this.logger.debug(`Called ${CalendarService.name}`);
    const dreamDiaries = await this.dreamDiaryRepository.findOne({
      where: {
        userId: userId,
        createdAt: Between(
          new Date(year, month - 1, day),
          new Date(year, month - 1, day + 1),
        ),
      },
      relations: ['author'],
    });
    return {
      diaryId: dreamDiaries.diaryId,
      title: dreamDiaries.title,
      content: dreamDiaries.content,
      viewCount: dreamDiaries.viewCount,
      nickname: dreamDiaries.author.nickname,
      imageUrl: dreamDiaries.imageUrl,
    } as DreamDiaryFeedDto;
  }
}
