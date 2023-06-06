import { Module } from '@nestjs/common';
import { LikeBookmarkListController } from './likebookmarklist.controller';
import { LikeBookmarkListService } from './likebookmarklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { User } from 'src/entities/user.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { Category } from 'src/entities/category.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Board } from 'src/entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DreamDiary,
      User,
      DiaryCategory,
      Category,
      Favorite,
      Bookmark,
      Board,
    ]),
    AuthModule,
  ],
  controllers: [LikeBookmarkListController],
  providers: [LikeBookmarkListService],
})
export class LikeBookmarkListModule {}
