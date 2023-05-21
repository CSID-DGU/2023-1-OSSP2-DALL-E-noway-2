import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DreamDiaryService } from './dreamdiary.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SearchType } from 'src/enum/search.type';
import { SortType } from 'src/enum/sort.type';
import { DreamDiaryCreateRequestDto } from 'src/dto/dreamdiary.create.request.dto';
import { User } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';

@ApiTags('dream-diary')
@Controller('dream-diary')
export class DreamDiaryController {
  constructor(private readonly dreamdiaryService: DreamDiaryService) {}

  @ApiOperation({
    summary: '꿈일기 피드 목록',
    description: '꿈일기 피드 목록을 조회합니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 피드 목록을 조회합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('dream-diary/feeds/:search-type/:sort-type/')
  async getDreamDiaryFeeds(
    @Param('search-type') searchType: SearchType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
    @Query('search-keyword', new DefaultValuePipe(' ')) keyWord: string,
  ) {
    try {
      const dreamdiaryfeeds = await this.dreamdiaryService.getAllFeeds(
        searchType,
        page,
        length,
        keyWord,
      );
      return dreamdiaryfeeds;
    } catch (err) {
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
    summary: '꿈일기 피드 목록',
    description: '꿈일기 피드 목록을 조회합니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 피드를 조회합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('dreamdiary/:diary-id')
  async getFeedbyDiaryId(@Param('diary-id', ParseIntPipe) diaryId: number) {
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

      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '꿈일기 생성',
    description: '꿈일기 생성합니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 생성합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createDreamDiary(
    @Body() dreamDiaryRequestDto: DreamDiaryCreateRequestDto,
    @User() user: UserDto,
  ) {
    try {
      return this.dreamdiaryService.creatDreamDiary(
        dreamDiaryRequestDto,
        user.userId,
      );
    } catch (err) {
      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }
}
