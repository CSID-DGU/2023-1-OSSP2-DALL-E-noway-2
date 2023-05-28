import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/user.decorator';
import { PostBookmarkDto } from 'src/dto/post.bookmark.dto';
import { PostLikeDto } from 'src/dto/post.like.dto';
import { PostRequestDto } from 'src/dto/post.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { Board } from 'src/entities/board.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { BoardType } from 'src/enum/board.type';
import { FilterType } from 'src/enum/filter.type';
import { BoardService } from './board.service';

@ApiTags('Board')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '게시글 생성',
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

  @ApiOperation({
    summary: '게시글 세부내용 수정',
    description: 'post_id에 해당하는 게시글의 세부사항을 수정합니다.',
  })
  @Put('/posts/:post_id')
  @UseGuards(AuthGuard('jwt'))
  async postUpdate(
    @Param('post_id') postId: number,
    @Body() postRequestDto: PostRequestDto,
  ) {
    postRequestDto.postId = postId;
    return await this.boardService.postUpdate(postRequestDto);
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

  //URL을 통해 받아오는 BoardType과 FilterType을 매칭시켜주는 함수
  boardTypeMatch(boardType: BoardType) {
    switch (boardType) {
      case BoardType.FREE:
        return FilterType.FREE;
      case BoardType.TIP:
        return FilterType.TIP;
      case BoardType.REQUEST:
        return FilterType.REQUEST;
      default:
        throw new HttpException('Invalid board type', HttpStatus.BAD_REQUEST);
    }
  }

  // Like와 Bookmark의 Dto 값들을 설정하는 함수
  setLikeBookmarkDto(
    opt: string,
    postId: number,
    boardType: BoardType,
    user: UserDto,
  ) {
    if (opt == 'Like') {
      const postLikeDto = new PostLikeDto();
      postLikeDto.id = postId;
      postLikeDto.filterType = this.boardTypeMatch(boardType);
      postLikeDto.userId = user.userId;
      return postLikeDto;
    }

    if (opt == 'Bookmark') {
      const postBookmarkDto = new PostBookmarkDto();
      postBookmarkDto.id = postId;
      postBookmarkDto.filterType = this.boardTypeMatch(boardType);
      postBookmarkDto.userId = user.userId;
      return postBookmarkDto;
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
    const postLikeDto = this.setLikeBookmarkDto(
      'Like',
      postId,
      boardType,
      user,
    );
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
    const postLikeDto = this.setLikeBookmarkDto(
      'Like',
      postId,
      boardType,
      user,
    );
    return await this.boardService.postLikeCancel(postLikeDto);
  }

  @ApiOperation({
    summary: '게시글 즐겨찾기 설정',
    description:
      'post_id, post_type, userId 정보를 바탕으로 해당하는 게시글 즐겨찾기를 설정합니다.',
  })
  @Post('/posts/:post_id/:post_type/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async postBookmark(
    @Param('post_id') postId: number,
    @Param('post_type') boardType: BoardType,
    @GetUser() user: UserDto,
  ): Promise<Bookmark> {
    const postBookmarkDto = this.setLikeBookmarkDto(
      'Bookmark',
      postId,
      boardType,
      user,
    );
    return await this.boardService.postBookmark(postBookmarkDto);
  }

  @ApiOperation({
    summary: '게시글 즐겨찾기 취소',
    description: 'post_id에 해당하는 게시글 즐겨찾기를 취소합니다.',
  })
  @Delete('/posts/:post_id/:post_type/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async postBookmarkCancel(
    @Param('post_id') postId: number,
    @Param('post_type') boardType: BoardType,
    @GetUser() user: UserDto,
  ) {
    const postBookmarkDto = this.setLikeBookmarkDto(
      'Bookmark',
      postId,
      boardType,
      user,
    );
    return await this.boardService.postBookmarkCancel(postBookmarkDto);
  }
}
