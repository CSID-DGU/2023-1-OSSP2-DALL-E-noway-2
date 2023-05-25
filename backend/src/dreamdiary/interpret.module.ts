import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DreamDiaryService } from './interpret.service';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { OpenAIService } from 'src/util/openai.service';
import { DreamDiaryController } from './interpret.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DreamDiary])],
  controllers: [DreamDiaryController],
  providers: [DreamDiaryService, OpenAIService],
})
export class DreamDiaryModule {}
