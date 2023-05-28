import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/user.decorator';
import { PostLikeDto } from 'src/dto/post.like.dto';
import { PostRequestDto } from 'src/dto/post.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { Favorite } from 'src/entities/favorite.entity';
import { BoardType } from 'src/enum/board.type';
import { FilterType } from 'src/enum/filter.type';
import { BoardService } from './board.service';

@ApiTags('Board')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '기타 게시글 생성',
    description:
      'post_type에 해당하는 게시판에 PostRequestDto에서 받아온 정보를 바탕으로 새로운 게시글을 생성합니다.',
  })
  @Post('/posts/:post_type')
  @UseGuards(AuthGuard('jwt'))
  async createPost(
    @Body() postRequestDto: PostRequestDto,
    @Param('post_type') boardType: BoardType,
    @GetUser() user: UserDto,
  ) {
    postRequestDto.boardType = boardType;
    postRequestDto.userId = user.userId;
    const result = await this.boardService.createPost(postRequestDto);
    return result.postId;
  }

  // 입력으로 받아온 boardType 자료형과 Favorite Entity의 filterType 자료형이 일치하지 않기에 자료형을 매칭시켜줄 함수.
  boardTypeMatch(postLikeDto: PostLikeDto, boardType: BoardType) {
    switch (boardType) {
      case BoardType.FREE:
        postLikeDto.filterType = FilterType.FREE;
        break;
      case BoardType.TIP:
        postLikeDto.filterType = FilterType.TIP;
        break;
      case BoardType.REQUEST:
        postLikeDto.filterType = FilterType.REQUEST;
        break;
      default:
        throw new HttpException('Invalid board type', HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: '게시글 좋아요 설정',
    description:
      'post_id, post_type, userId 정보를 바탕으로 해당하는 게시글 좋아요를 설정합니다.',
  })
  @Post('/posts/:post_id/:post_type/like')
  @UseGuards(AuthGuard('jwt'))
  async postLike(
    @Param('post_id') postId: number,
    @Param('post_type') boardType: BoardType,
    @GetUser() user: UserDto,
  ): Promise<Favorite> {
    const postLikeDto = new PostLikeDto();
    postLikeDto.id = postId;
    this.boardTypeMatch(postLikeDto, boardType);
    postLikeDto.userId = user.userId;

    return await this.boardService.postLike(postLikeDto);
  }

  @ApiOperation({
    summary: '게시글 좋아요 취소',
    description: 'post_id에 해당하는 게시글 좋아요를 취소합니다.',
  })
  @Delete('/posts/:post_id/:post_type/like')
  @UseGuards(AuthGuard('jwt'))
  async postLikeCancel(
    @Param('post_id') postId: number,
    @Param('post_type') boardType: BoardType,
    @GetUser() user: UserDto,
  ) {
    const postLikeDto = new PostLikeDto();
    postLikeDto.id = postId;
    this.boardTypeMatch(postLikeDto, boardType);
    postLikeDto.userId = user.userId;
    return await this.boardService.postLikeCancel(postLikeDto);
  }

  @ApiOperation({
    summary: '게시글 삭제',
    description: 'post_id에 해당하는 게시글을 삭제합니다.',
  })
  @Delete('/posts/:post_id')
  @UseGuards(AuthGuard('jwt'))
  async postDelete(@Param('post_id') postId: number) {
    return await this.boardService.postDelete(postId);
  }
}
