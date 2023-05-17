import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DreamDiaryService } from './dreamdiary.service';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { DreamDiaryController } from './dreamdiary.controller';
import { User } from 'src/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([DreamDiary,User]), AuthModule],
  controllers: [DreamDiaryController],
  providers: [DreamDiaryService],
})
export class DreamDiaryModule {}