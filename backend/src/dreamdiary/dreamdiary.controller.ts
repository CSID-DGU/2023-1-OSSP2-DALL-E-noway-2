import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DreamDiaryService } from './dreamdiary.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { SearchType } from 'src/enum/search.type';
import { SortType } from 'src/enum/sort.type';

@Controller('dream-diary')
export class DreamDiaryController {
  constructor(private readonly dreamdiaryService: DreamDiaryService) {}

  @ApiOperation({
    summary: '꿈일기 피드 목록',
    description: '꿈일기 피드 목록을 조회합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('dream-diary/feeds/:search-type/:sort-type/')
  async getDreamDiaryFeeds(
    @Param('search-type', new ParseEnumPipe(SearchType)) searchType: SearchType,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
    @Query('search-keyword', new DefaultValuePipe('')) keyWord: string,
  ) {
    //검색유형,정렬유형,검색 모두 ' '이면 getAllFeeds 반환 아닐경우 하나하나씩 if else사용해서
    const dreamdiaryfeeds = await this.dreamdiaryService.getAllFeeds(
      searchType,
      page,
      length,
      keyWord,
    );
    return dreamdiaryfeeds;

    //return 값만 바꿔주면 됨
  }

  @ApiOperation({
    summary: '꿈일기 피드 목록',
    description: '꿈일기 피드 목록을 조회합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
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
