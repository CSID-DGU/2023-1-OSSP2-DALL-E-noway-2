import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DreamDiaryService } from './dreamdiary.service';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { DreamDiaryController } from './dreamdiary.controller';
import { User } from 'src/entities/user.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DreamDiary, User, DiaryCategory]),
    UtilModule,
  ],
  controllers: [DreamDiaryController],
  providers: [DreamDiaryService],
})
export class DreamDiaryModule {}
