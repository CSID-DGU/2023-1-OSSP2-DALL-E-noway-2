import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  Param,
  ParseArrayPipe,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DreamDiaryService } from './dreamdiary.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SearchType } from 'src/enum/search.type';
import { SortType } from 'src/enum/sort.type';
import { DreamDiaryCreateRequestDto } from 'src/dto/dreamdiary.create.request.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { DreamDiaryFeedsResponseDto } from 'src/dto/dreamdiary.feeds.response.dto';
import { Favorite } from 'src/entities/favorite.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { CategoryResponseDto } from 'src/dto/category.response.dto';
import { DreamDiaryUpdateRequestDto } from 'src/dto/dreamdiary.update.request.dto';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { uuid } from 'uuidv4';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

@ApiTags('dream-diary')
@Controller('dream-diary')
export class DreamDiaryController {
  private logger = new Logger(DreamDiaryController.name);
  constructor(
    private readonly dreamdiaryService: DreamDiaryService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  @ApiOperation({
    summary: '꿈일기 피드 목록',
    description: '꿈일기 피드 목록을 조회합니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 피드 목록을 조회합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('feeds/:searchType')
  async getDreamDiaryFeeds(
    @Param('searchType') searchType: SearchType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
    @Query('search-keyword', new DefaultValuePipe(' ')) keyWord: string,
  ): Promise<DreamDiaryFeedsResponseDto> {
    try {
      const dreamdiaryfeeds = await this.dreamdiaryService.getAllFeeds(
        searchType,
        page,
        length,
        keyWord,
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
    summary: '꿈일기 피드 조회',
    description: '꿈일기 피드를 조회합니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 피드를 조회합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':diaryId')
  async getFeedbyDiaryId(@Param('diaryId', ParseIntPipe) diaryId: number) {
    try {
      const dreamDiaryfeed = await this.dreamdiaryService.getFeedbyDiaryId(
        diaryId,
      );

      return dreamDiaryfeed;
    } catch (err) {
      //존재하지 않는 유저(탈퇴한 유저)
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
    }
  }

  @ApiOperation({
    summary: '꿈일기 생성',
    description: '꿈일기 생성합니다.',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = `uploads`;
          if (!existsSync(path)) {
            mkdirSync(path);
          }
          cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: DreamDiaryCreateRequestDto,
  })
  @ApiCreatedResponse({ description: '꿈일기 생성합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createDreamDiary(
    @GetUser() user: UserDto,
    @Body('title') title: string,
    @Body('category', ParseArrayPipe) category: number[],
    @Body('dreamScore') dreamScore: number,
    @Body('disclosureScope') disclosureScope: DisclosureScopeType,
    @Body('content') content: string,
    @UploadedFile() image?: any,
  ): Promise<number> {
    try {
      let imageUrl: string;
      console.log(category);
      console.log(typeof category);
      if (image) {
        imageUrl = `${this.configService.get<string>('beHost')}/${image.path}`;
      }

      return await this.dreamdiaryService.creatDreamDiary(
        title,
        category,
        dreamScore,
        disclosureScope,
        content,
        user.userId,
        imageUrl,
      );
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 수정',
    description: '꿈일기 수정합니다.',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = `uploads`;
          if (!existsSync(path)) {
            mkdirSync(path);
          }
          cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: DreamDiaryUpdateRequestDto,
  })
  @ApiCreatedResponse({ description: '꿈일기 수정합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Put(':diaryId')
  async updateDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Body('title') title: string,
    @Body('category', ParseArrayPipe) category: number[],
    @Body('dreamScore') dreamScore: number,
    @Body('disclosureScope') disclosureScope: DisclosureScopeType,
    @Body('content') content: string,
    @UploadedFile() image?: any,
  ): Promise<void> {
    try {
      let imageUrl: string;

      if (image) {
        imageUrl = `${this.configService.get<string>('beHost')}/${image.path}`;
      }

      return this.dreamdiaryService.updateDreamDiary(
        diaryId,
        title,
        category,
        dreamScore,
        disclosureScope,
        content,
        imageUrl,
      );
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 삭제',
    description: '꿈일기 삭제합니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 삭제합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':diaryId')
  async deleteDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @GetUser() user: UserDto,
  ) {
    try {
      return this.dreamdiaryService.deleteDreamDiary(diaryId, user.userId);
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 좋아요',
    description: '꿈일기 좋아요 추가합니다.',
  })
  @ApiCreatedResponse({ description: '좋아요 추가합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post(':diaryId/like')
  async addFavoriteDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @GetUser() user: UserDto,
  ): Promise<void> {
    try {
      return await this.dreamdiaryService.addFavoriteDreamDiary(
        diaryId,
        user.userId,
      );
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 좋아요 삭제',
    description: '꿈일기 좋아요 삭제합니다.',
  })
  @ApiCreatedResponse({ description: '좋아요 삭제합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':diaryId/like')
  async deleteFavoriteDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ) {
    try {
      return this.dreamdiaryService.deleteFavoriteDreamDiary(diaryId);
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 즐겨찾기',
    description: '꿈일기 즐겨찾기 추가합니다.',
  })
  @ApiCreatedResponse({ description: '즐겨찾기 추가합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post(':diaryId/bookmark')
  async addBookmarkDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @GetUser() user: UserDto,
  ): Promise<void> {
    try {
      return await this.dreamdiaryService.addBookmarkDreamDiary(
        diaryId,
        user.userId,
      );
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 즐겨찾기 삭제',
    description: '꿈일기 즐겨찾기 삭제합니다.',
  })
  @ApiCreatedResponse({ description: '즐겨찾기 삭제합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':diaryId/bookmark')
  async deleteBookmarkDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ) {
    try {
      return this.dreamdiaryService.deleteBookmarkDreamDiary(diaryId);
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }
}
