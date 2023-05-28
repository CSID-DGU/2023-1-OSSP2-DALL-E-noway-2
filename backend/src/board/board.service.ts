import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostBookmarkDto } from 'src/dto/post.bookmark.dto';
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

  // 게시글 삭제 기능 // post_id에 해당하는 게시글을 삭제합니다.
  async postDelete(postId: number) {
    const result = await this.boardRepository.delete(postId);

    if (result.affected === 0) {
      throw new NotFoundException(`Could not find post with ID ${postId}`);
    }
    return result;
  }

  // 게시글 좋아요 설정 기능 / 게시글의 ID를 받아와 해당하는 게시글의 좋아요를 설정하는 API
  async postLike(postLikeDto: PostLikeDto): Promise<Favorite> {
    const board = await this.favoriteRepository.create(postLikeDto);
    board.createdAt = new Date();
    return await this.favoriteRepository.save(board);
  }

  // 게시글 좋아요 취소 기능 // post_id, post_type, userId를 바탕으로 해당 게시글의 좋아요를 취소합니다.
  async postLikeCancel(postLikeDto: PostLikeDto) {
    const result = await this.favoriteRepository.delete(postLikeDto);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Could not find like post with postID ${postLikeDto.id}`,
      );
    }
    return result;
  }

  // 게시글 북마크 설정 기능 / post_id, post_type, userId 정보를 바탕으로 해당하는 게시글 즐겨찾기를 설정합니다.
  async postBookmark(postBookmarkDto: PostBookmarkDto): Promise<Bookmark> {
    const board = await this.bookmarkRepository.create(postBookmarkDto);
    board.createdAt = new Date();
    return await this.bookmarkRepository.save(board);
  }

  // 게시글 북마크 취소 기능 // post_id에 해당하는 게시글 즐겨찾기를 취소합니다.
  async postBookmarkCancel(postBookmarkDto: PostBookmarkDto) {
    const result = await this.bookmarkRepository.delete(postBookmarkDto);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Could not find bookmark post with postID ${postBookmarkDto.id}`,
      );
    }
    return result;
  }
}
