import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DreamDiaryService } from './dreamdiary.service';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { DreamDiaryController } from './dreamdiary.controller';
import { User } from 'src/entities/user.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { Category } from 'src/entities/category.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { UtilModule } from 'src/util/util.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DreamDiary,
      User,
      DiaryCategory,
      Category,
      Favorite,
      Bookmark,
    ]),
    AuthModule,
    UtilModule,
    UserModule,
  ],
  controllers: [DreamDiaryController],
  providers: [DreamDiaryService],
})
export class DreamDiaryModule {}
