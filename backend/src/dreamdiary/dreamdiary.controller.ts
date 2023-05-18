import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
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
  //@UseGuards(AuthGuard('jwt'))
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
  //@UseGuards(AuthGuard('jwt'))
  @Get('dreamdiary/:diary-id')
  async getFeedbyDiaryId(
    @Param('diaryId', ParseIntPipe) diaryId: number,
    //@GetUser() user:{id: number},
  ) {
    const dreamDiaryfeed = await this.dreamdiaryService.getFeedbyDiaryId(
      diaryId,
    );

    return dreamDiaryfeed;
  }
}
