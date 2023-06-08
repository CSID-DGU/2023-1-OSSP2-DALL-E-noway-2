import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { User } from 'src/entities/user.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { Category } from 'src/entities/category.entity';
import { DreamDiary } from 'src/entities/dream.diary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DiaryCategory, Category, DreamDiary]),
  ],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
