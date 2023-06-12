import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { GetUser } from 'src/decorator/user.decorator';
import { PostBookmarkDto } from 'src/dto/post.bookmark.dto';
import { PostLikeDto } from 'src/dto/post.like.dto';
import { PostRequestDto } from 'src/dto/post.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { BoardType } from 'src/enum/board.type';
import { FilterType } from 'src/enum/filter.type';
import { BoardService } from './board.service';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { PostResponseDto } from 'src/dto/post.response.dto';
import { PostsResponseDto } from 'src/dto/posts.response.dto';
import { SearchType } from 'src/enum/search.type';

@ApiTags('Board')
@Controller('boards')
export class BoardController {
  constructor(
    private readonly boardService: BoardService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: '게시글 생성',
    description:
      'post_type에 해당하는 게시판에 PostRequestDto에서 받아온 정보를 바탕으로 새로운 게시글을 생성합니다.',
  })
  @Post('/posts/:post_type')
  @UseInterceptors(
    FileInterceptor(`image`, {
      storage: diskStorage({
        destination(req, file, callback) {
          let path: string;
          if (process.env.NODE_ENV === 'production') {
            path = '../uploads';
          } else {
            path = 'uploads';
          }
          if (!existsSync(path)) {
            mkdirSync(path);
          }
          callback(null, path);
        },
        filename(req, file, callback) {
          callback(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: PostRequestDto,
  })
  @ApiParam({
    name: 'post_type',
    type: 'enum',
    enum: BoardType,
    required: true,
  })
  @UseGuards(AuthGuard('jwt'))
  async createPost(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('disclosureScope') disclosureScope: DisclosureScopeType,
    @Param('post_type', new ParseEnumPipe(BoardType)) boardType: BoardType,
    @GetUser() user: UserDto,
    @UploadedFile() image?: any,
  ) {
    let imageUrl: string;
    if (image) {
      imageUrl = `${this.configService.get<string>('beHost')}/uploads/${
        image.filename
      }`;
    }
    const result = await this.boardService.createPost(
      title,
      content,
      disclosureScope,
      boardType,
      user.userId,
      imageUrl,
    );
    return result.postId;
  }
  @ApiOperation({
    summary: '게시글 세부내용 조회',
    description: 'post_id에 해당하는 게시글의 세부사항을 조회합니다.',
  })
  @Get('/posts/:post_id')
  @UseGuards(AuthGuard('jwt'))
  async postShow(@Param('post_id') postId: number): Promise<PostResponseDto> {
    return await this.boardService.postShow(postId);
  }

  @ApiOperation({
    summary: '게시글 세부내용 수정',
    description: 'post_id에 해당하는 게시글의 세부사항을 수정합니다.',
  })
  @Put('/posts/:post_id')
  @UseInterceptors(
    FileInterceptor(`image`, {
      storage: diskStorage({
        destination(req, file, callback) {
          let path: string;
          if (process.env.NODE_ENV === 'production') {
            path = '../uploads';
          } else {
            path = 'uploads';
          }
          if (!existsSync(path)) {
            mkdirSync(path);
          }
          callback(null, path);
        },
        filename(req, file, callback) {
          callback(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: PostRequestDto,
  })
  @UseGuards(AuthGuard('jwt'))
  async postUpdate(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('disclosureScope') disclosureScope: DisclosureScopeType,
    @Param('post_id') postId: number,
    @GetUser() user: UserDto,
    @UploadedFile() image?: any,
  ) {
    return await this.boardService.postUpdate(
      postId,
      title,
      content,
      disclosureScope,
      user.userId,
      image,
    );
  }

  @ApiOperation({
    summary: '게시글 목록 조회',
    description: 'post_type에 해당하는 게시판의 게시글 목록을 조회합니다.',
  })
  @Get('/posts/:post_type/:search_type/list')
  @ApiParam({
    name: 'post_type',
    type: 'enum',
    enum: BoardType,
    required: true,
  })
  @ApiParam({
    name: 'search_type',
    type: 'enum',
    enum: SearchType,
    required: true,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: true,
  })
  @ApiQuery({
    name: 'length',
    type: 'number',
    required: true,
  })
  @ApiQuery({
    name: 'searchKeyword',
    type: 'string',
    required: false,
  })
  @UseGuards(AuthGuard('jwt'))
  async postList(
    @Param('post_type', new ParseEnumPipe(BoardType)) boardType: BoardType,
    @Param('search_type', new ParseEnumPipe(SearchType)) searchType: SearchType,
    @Query('page') page: number,
    @Query('length') length: number,
    @Query('searchKeyword') searchKeyword?: string,
  ): Promise<PostsResponseDto> {
    return await this.boardService.postList(
      boardType,
      searchType,
      page,
      length,
      searchKeyword,
    );
  }

  @ApiOperation({
    summary: '게시글 삭제',
    description: 'post_id에 해당하는 게시글을 삭제합니다.',
  })
  @Delete('/posts/:post_id')
  @UseGuards(AuthGuard('jwt'))
  async postDelete(@Param('post_id') postId: number, @GetUser() user: UserDto) {
    const postRequestDto = new PostRequestDto();
    postRequestDto.postId = postId;
    postRequestDto.userId = user.userId;
    return await this.boardService.postDelete(postRequestDto);
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
  @ApiParam({
    name: 'post_type',
    type: 'enum',
    enum: BoardType,
    required: true,
  })
  @Post('/posts/:post_id/:post_type/like')
  @UseGuards(AuthGuard('jwt'))
  async postLike(
    @Param('post_id') postId: number,
    @Param('post_type', new ParseEnumPipe(BoardType)) boardType: BoardType,
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
  @ApiParam({
    name: 'post_type',
    type: 'enum',
    enum: BoardType,
    required: true,
  })
  @Delete('/posts/:post_id/:post_type/like')
  @UseGuards(AuthGuard('jwt'))
  async postLikeCancel(
    @Param('post_id') postId: number,
    @Param('post_type', new ParseEnumPipe(BoardType)) boardType: BoardType,
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
  @ApiParam({
    name: 'post_type',
    type: 'enum',
    enum: BoardType,
    required: true,
  })
  @Post('/posts/:post_id/:post_type/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async postBookmark(
    @Param('post_id') postId: number,
    @Param('post_type', new ParseEnumPipe(BoardType)) boardType: BoardType,
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
  @ApiParam({
    name: 'post_type',
    type: 'enum',
    enum: BoardType,
    required: true,
  })
  @Delete('/posts/:post_id/:post_type/bookmark')
  @UseGuards(AuthGuard('jwt'))
  async postBookmarkCancel(
    @Param('post_id') postId: number,
    @Param('post_type', new ParseEnumPipe(BoardType)) boardType: BoardType,
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
