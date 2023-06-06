import { Module, forwardRef } from '@nestjs/common';
import { DreamDiaryModule } from '../dreamdiary.module';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DreamDiary } from 'src/entities/dream.diary.entity';

@Module({
  imports: [
    forwardRef(() => DreamDiaryModule),
    TypeOrmModule.forFeature([DreamDiary]),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
