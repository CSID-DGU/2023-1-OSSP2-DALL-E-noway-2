import { Module, forwardRef } from '@nestjs/common';
import { DreamDiaryModule } from '../dreamdiary.module';
import { CalendarController } from './calendar.controller';

@Module({
  imports: [forwardRef(() => DreamDiaryModule)],
  controllers: [CalendarController],
  providers: [],
})
export class CalendarModule {}
