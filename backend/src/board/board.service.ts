import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLikeDto } from 'src/dto/post.like.dto';
import { PostRequestDto } from 'src/dto/post.request.dto';
import { Board } from 'src/entities/board.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,

    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,

    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  // 게시글 생성 기능 / 게시글의 종류와 게시글 내용을 받아와 해당하는 게시판에 게시글을 등록하는 API
  async createPost(postRequestDto: PostRequestDto): Promise<Board> {
    const board = this.boardRepository.create(postRequestDto);
    board.createdAt = new Date();
    return await this.boardRepository.save(board);
  }

  // 게시글 좋아요 설정 기능 / 게시글의 ID를 받아와 해당하는 게시글의 좋아요를 설정하는 API
  async postLike(postLikeDto: PostLikeDto): Promise<Favorite> {
    const board = await this.favoriteRepository.create(postLikeDto);
    board.createdAt = new Date();
    return await this.favoriteRepository.save(board);
  }

  // 게시글 좋아요 취소 기능 // post_id, post_type, userId를 바탕으로 해당 게시글의 좋아요를 취소합니다.
  async postLikeCancel(postLikeDto: PostLikeDto) {
    return await this.favoriteRepository.delete(postLikeDto);
  }
}
