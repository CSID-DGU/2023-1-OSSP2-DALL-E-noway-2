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
  ValidationPipe,
} from '@nestjs/common';
import { DreamDiaryService } from './dreamdiary.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SearchType } from 'src/enum/search.type';
import { DreamDiaryCreateRequestDto } from 'src/dto/dreamdiary.create.request.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { DreamDiaryFeedsResponseDto } from 'src/dto/dreamdiary.feeds.response.dto';
import { DreamDiaryUpdateRequestDto } from 'src/dto/dreamdiary.update.request.dto';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { v4 as uuid } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DreamDiaryResponseDto } from 'src/dto/dreamdiary.response.dto';
import { GenerateDreamDiaryImagesRequestDto } from 'src/dto/generate.dreamdiary.images.request.dto';
import { GeneratedImagesResponseDto } from 'src/dto/generated.images.response.dto';
import { FilterType } from 'src/enum/filter.type';

@ApiTags('dream-diary')
@Controller('dream-diary')
export class DreamDiaryController {
  private logger = new Logger(DreamDiaryController.name);
  constructor(
    private readonly dreamDiaryService: DreamDiaryService,
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
      const dreamdiaryfeeds = await this.dreamDiaryService.getAllFeeds(
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
  @ApiCreatedResponse({
    description: '꿈일기 피드를 조회합니다.',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':diaryId')
  async getFeedbyDiaryId(
    @Param('diaryId', ParseIntPipe) diaryId: number,
  ): Promise<DreamDiaryResponseDto> {
    try {
      const dreamDiaryfeed = await this.dreamDiaryService.getFeedbyDiaryId(
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
          let path: string;
          if (process.env.NODE_ENV === 'production') {
            path = '../uploads';
          } else {
            path = 'uploads';
          }
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
      if (image) {
        imageUrl = `${this.configService.get<string>('beHost')}/uploads/${
          image.filename
        }`;
      }

      return await this.dreamDiaryService.creatDreamDiary(
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
          let path: string;
          if (process.env.NODE_ENV === 'production') {
            path = '../uploads';
          } else {
            path = 'uploads';
          }
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
        imageUrl = `${this.configService.get<string>('beHost')}/uploads/${
          image.filename
        }`;
      }

      return this.dreamDiaryService.updateDreamDiary(
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
  @ApiParam({
    name: 'filterType',
    type: 'enum',
    enum: FilterType,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':diaryId/:filterType')
  async deleteDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Param('filterType') filterType: FilterType,
    @GetUser() user: UserDto,
  ) {
    try {
      return this.dreamDiaryService.deleteDreamDiary(
        diaryId,
        filterType,
        user.userId,
      );
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
      return await this.dreamDiaryService.addFavoriteDreamDiary(
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
  @ApiParam({
    name: 'filterType',
    type: 'enum',
    enum: FilterType,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':diaryId/:filterType/like')
  async deleteFavoriteDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Param('filterType') filterType: FilterType,
    @GetUser() user: UserDto,
  ) {
    try {
      return this.dreamDiaryService.deleteFavoriteDreamDiary(
        diaryId,
        filterType,
        user.userId,
      );
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
      return await this.dreamDiaryService.addBookmarkDreamDiary(
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
  @ApiParam({
    name: 'filterType',
    type: 'enum',
    enum: FilterType,
  })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':diaryId/:filterType/bookmark')
  async deleteBookmarkDreamDiary(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    @Param('filterType') filterType: FilterType,
    @GetUser() user: UserDto,
  ) {
    try {
      return this.dreamDiaryService.deleteBookmarkDreamDiary(
        diaryId,
        filterType,
        user.userId,
      );
    } catch (err) {
      //기타 에러 전체에서 처리
    }
  }

  @ApiOperation({
    summary: '꿈일기 이미지 생성',
    description:
      '꿈일기 이미지 생성합니다. 하루에 최대 3번까지만 무료로 생성할 수 있습니다.',
  })
  @ApiBody({ type: GenerateDreamDiaryImagesRequestDto })
  @ApiCreatedResponse({
    description:
      '꿈일기 이미지 생성에 성공합니다. 응답으로 생성된 Blob 이미지 배열과 남은 생성 가능 횟수를 반환합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 문제가 발생한 경우, 400 Bad Request를 반환합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '무료 이미지 생성 횟수를 초과한 경우, 403 Forbidden을 반환합니다.',
  })
  @Post('dream-images')
  @UseGuards(AuthGuard('jwt'))
  async createDreamDiaryImages(
    @Body(new ValidationPipe())
    generateDreamDiaryImagesRequestDto: GenerateDreamDiaryImagesRequestDto,
    @GetUser() user: UserDto,
  ): Promise<GeneratedImagesResponseDto> {
    try {
      return await this.dreamDiaryService.createDreamDiaryImages(
        generateDreamDiaryImagesRequestDto.title,
        generateDreamDiaryImagesRequestDto.content,
        generateDreamDiaryImagesRequestDto.n,
        user.userId,
      );
    } catch (err) {
      this.logger.error(err.message);
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '해몽 생성',
    description: '해당 다이어리 내용의 해몽을 저장합니다.',
  })
  @Put(':id/interpretation')
  async createDreamInterpretation(@Param('id') diaryId: number) {
    const interpretation =
      await this.dreamDiaryService.createDreamInterpretation(diaryId);
    return { interpretation };
  }
}
