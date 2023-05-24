import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DreamDiaryService } from './dreamdiary.service';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { DreamDiaryController } from './dreamdiary.controller';
import { User } from 'src/entities/user.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { UtilModule } from 'src/util/util.module';
import { ImageRequests } from 'src/entities/image.requests.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DreamDiary, User, DiaryCategory, ImageRequests]),
    UtilModule,
  ],
  controllers: [DreamDiaryController],
  providers: [DreamDiaryService],
})
export class DreamDiaryModule {}
