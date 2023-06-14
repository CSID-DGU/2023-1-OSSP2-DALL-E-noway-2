import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LikeBookmarkListService } from './likebookmarklist.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DreamDiaryFeedsResponseDto } from 'src/dto/dreamdiary.feeds.response.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { BoardFeedsResponseDto } from 'src/dto/likebookmark.boards.response.dto';
import { BoardType } from 'src/enum/board.type';

@Controller()
export class LikeBookmarkListController {
  private logger = new Logger(LikeBookmarkListService.name);
  constructor(
    private readonly likeBookmarkListService: LikeBookmarkListService,
  ) {}

  @ApiOperation({
    summary: '꿈일기 좋아요 피드 목록',
    description: '꿈일기 좋아요 피드 목록을 조회합니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 좋아요 피드 목록을 조회합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('like/dream-diary')
  async getLikeDiaryFeeds(
    @GetUser() user: UserDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<DreamDiaryFeedsResponseDto> {
    try {
      const dreamdiaryfeeds =
        await this.likeBookmarkListService.getDiaryLikeFeeds(
          user.userId,
          page,
          length,
        );
      return dreamdiaryfeeds;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 즐겨찾기 피드 목록',
    description: '꿈일기 즐겨찾기 피드 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    description: '꿈일기 즐겨찾기 피드 목록을 조회합니다.',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('bookmarks/dream-diary')
  async getBookmarkDiaryFeeds(
    @GetUser() user: UserDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<DreamDiaryFeedsResponseDto> {
    try {
      const dreamdiaryfeeds =
        await this.likeBookmarkListService.getDiaryBookmarkFeeds(
          user.userId,
          page,
          length,
        );
      return dreamdiaryfeeds;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '게시판 좋아요 피드 목록',
    description: '게시판 좋아요 피드 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    description: '게시판 좋아요 피드 목록을 조회합니다.',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @ApiParam({
    name: 'posttype',
    description: '게시판 타입',
    type: 'enum',
    enum: BoardType,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('like/:posttype/boards')
  async getLikeBoardFeeds(
    @GetUser() user: UserDto,
    @Param('posttype') posttype: BoardType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<BoardFeedsResponseDto> {
    try {
      const boardLikefeeds =
        await this.likeBookmarkListService.getBoardLikeFeeds(
          user.userId,
          posttype,
          page,
          length,
        );
      return boardLikefeeds;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '게시판 즐겨찾기 피드 목록',
    description: '게시판 즐겨찾기 피드 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    description: '게시판 즐겨찾기 피드 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'posttype',
    description: '게시판 타입',
    type: 'enum',
    enum: BoardType,
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('bookmarks/:posttype/boards')
  async getBookmarkBoardFeeds(
    @GetUser() user: UserDto,
    @Param('posttype') posttype: BoardType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ): Promise<BoardFeedsResponseDto> {
    try {
      const boardLikefeeds =
        await this.likeBookmarkListService.getBookmarkBoardFeeds(
          user.userId,
          posttype,
          page,
          length,
        );
      return boardLikefeeds;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }
}
