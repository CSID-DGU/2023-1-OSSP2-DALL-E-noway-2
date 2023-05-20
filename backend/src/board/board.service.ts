import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRequestDto } from 'src/dto/post.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { Board } from 'src/entities/board.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
  ) {}

  // 게시글 생성 기능 / 게시글의 종류와 게시글 내용을 받아와 해당하는 게시판에 게시글을 등록하는 API
  async createPost(postRequestDto: PostRequestDto): Promise<Board> {
    const board = this.boardRepository.create(postRequestDto);
    board.createdAt = new Date();
    return await this.boardRepository.save(board);
  }
}
