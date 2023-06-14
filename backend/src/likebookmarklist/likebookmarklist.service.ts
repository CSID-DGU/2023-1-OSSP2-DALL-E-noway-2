import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  BoardFeedDto,
  BoardFeedsResponseDto,
} from 'src/dto/likebookmark.boards.response.dto';
import {
  DreamDiaryFeedDto,
  DreamDiaryFeedsResponseDto,
} from 'src/dto/likebookmark.diary.response.dto';
import { Board } from 'src/entities/board.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Category } from 'src/entities/category.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { User } from 'src/entities/user.entity';
import { BoardType } from 'src/enum/board.type';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { FilterType } from 'src/enum/filter.type';
import { Repository } from 'typeorm';

@Injectable()
export class LikeBookmarkListService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
    @InjectRepository(DiaryCategory)
    private readonly diaryCategoryRepository: Repository<DiaryCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Bookmark)
    private readonly bookMarkRepository: Repository<Bookmark>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async getDiaryLikeFeeds(
    userId: number,
    currentPage: number,
    length: number,
  ): Promise<DreamDiaryFeedsResponseDto> {
    const favoriteDreamDiaries = await this.dreamDiaryRepository.manager.query(
      `
      SELECT dream_diary.diary_id, dream_diary.title, dream_diary.view_count, user.nickname, dream_diary.image_url, dream_diary.content
      FROM favorite
      INNER JOIN dream_diary ON favorite.id = dream_diary.diary_id AND favorite.filter_type = 'DIARY'
      INNER JOIN user ON dream_diary.user_id = user.user_id
      WHERE favorite.user_id = ${userId}
      ORDER BY favorite.created_at DESC
      LIMIT ${(currentPage - 1) * length}, ${length}
      `,
    );

    const dreamDiaryFeedsDto: DreamDiaryFeedDto[] = favoriteDreamDiaries.map(
      (dreamDiary) => {
        const { diary_id, title, view_count, nickname, image_url, content } =
          dreamDiary;
        return {
          diaryId: diary_id,
          title: title,
          viewCount: view_count,
          nickname: nickname,
          imageUrl: image_url,
          content: content,
        };
      },
    );

    const totalLength = await this.favoriteRepository.count({
      where: {
        userId,
        filterType: FilterType.DIARY,
      },
    });

    const responseDto: DreamDiaryFeedsResponseDto = {
      dreamDiaryFeeds: dreamDiaryFeedsDto,
      totalLength,
    };

    return responseDto;
  }

  async getDiaryBookmarkFeeds(
    userId: number,
    currentPage: number,
    length: number,
  ): Promise<DreamDiaryFeedsResponseDto> {
    const bookmarkDreamDiaries = await this.dreamDiaryRepository.manager.query(
      `
      SELECT dream_diary.diary_id, dream_diary.title, dream_diary.view_count, user.nickname, dream_diary.image_url, dream_diary.content
      FROM bookmark
      INNER JOIN dream_diary ON bookmark.id = dream_diary.diary_id AND bookmark.filter_type = 'DIARY'
      INNER JOIN user ON dream_diary.user_id = user.user_id
      WHERE bookmark.user_id = ${userId}
      ORDER BY bookmark.created_at DESC
      LIMIT ${(currentPage - 1) * length}, ${length}
      `,
    );

    const dreamDiaryFeedsDto: DreamDiaryFeedDto[] = bookmarkDreamDiaries.map(
      (dreamDiary) => {
        const { diary_id, title, view_count, nickname, image_url, content } =
          dreamDiary;
        return {
          diaryId: diary_id,
          title: title,
          viewCount: view_count,
          nickname: nickname,
          imageUrl: image_url,
          content: content,
        };
      },
    );

    const totalLength = await this.bookMarkRepository.count({
      where: {
        userId,
        filterType: FilterType.DIARY,
      },
    });

    const responseDto: DreamDiaryFeedsResponseDto = {
      dreamDiaryFeeds: dreamDiaryFeedsDto,
      totalLength,
    };

    return responseDto;
  }

  async getBoardLikeFeeds(
    userId: number,
    postType: BoardType,
    currentPage: number,
    length: number,
  ): Promise<BoardFeedsResponseDto> {
    const favoriteBoards = await this.boardRepository.manager.query(
      `
      SELECT board.post_id, board.title, board.view_count, user.nickname, board.image_url, board.content
      FROM favorite
      INNER JOIN board ON favorite.id = board.post_id AND favorite.filter_type = '${postType}'
      INNER JOIN user ON board.user_id = user.user_id
      WHERE favorite.user_id = ${userId}
      ORDER BY favorite.created_at DESC
      LIMIT ${(currentPage - 1) * length}, ${length}
      `,
    );

    const boardFeedsDto: BoardFeedDto[] = favoriteBoards.map((board) => {
      const { post_id, title, view_count, nickname, image_url, content } =
        board;
      return {
        postId: post_id,
        title: title,
        viewCount: view_count,
        nickname: nickname,
        imageUrl: image_url,
        content: content,
      };
    });

    const totalLength = await this.favoriteRepository.count({
      where: {
        userId,
        // @ts-ignore
        filterType: postType,
      },
    });

    const responseDto: BoardFeedsResponseDto = {
      boardFeeds: boardFeedsDto,
      totalLength,
    };

    return responseDto;
  }

  async getBookmarkBoardFeeds(
    userId: number,
    postType: BoardType,
    currentPage: number,
    length: number,
  ): Promise<BoardFeedsResponseDto> {
    const bookmarkBoards = await this.boardRepository.manager.query(
      `
      SELECT board.post_id, board.title, board.view_count, user.nickname, board.image_url, board.content
      FROM bookmark
      INNER JOIN board ON bookmark.id = board.post_id AND bookmark.filter_type = '${postType}'
      INNER JOIN user ON board.user_id = user.user_id
      WHERE bookmark.user_id = ${userId}
      ORDER BY bookmark.created_at DESC
      LIMIT ${(currentPage - 1) * length}, ${length}
      `,
    );

    const boardFeedsDto: BoardFeedDto[] = bookmarkBoards.map((board) => {
      const { post_id, title, view_count, nickname, image_url, content } =
        board;
      return {
        postId: post_id,
        title: title,
        viewCount: view_count,
        nickname: nickname,
        imageUrl: image_url,
        content: content,
      };
    });

    const totalLength = await this.bookMarkRepository.count({
      where: {
        userId,
        // @ts-ignore
        filterType: postType,
      },
    });

    const responseDto: BoardFeedsResponseDto = {
      boardFeeds: boardFeedsDto,
      totalLength,
    };

    return responseDto;
  }
}
