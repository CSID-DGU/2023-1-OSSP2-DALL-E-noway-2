import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StatService } from './stat.service';
import { DreamDiaryCategoryCount } from 'src/dto/stat.category.count.response.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DreamDiaryCategoryScoreAvg } from 'src/dto/stat.score.avg.response.dto';

@ApiTags('Stat')
@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @ApiOperation({
    summary: '유저의 꿈 일기 카테고리별 통계',
    description: '유저의 꿈 일기 카테고리별 통계를 반환합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('categories/count')
  async getUserDreamDiaryCategoryCounts(
    @GetUser() user: UserDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<DreamDiaryCategoryCount[]> {
    return this.statService.getUserDreamDiaryCategoryCounts(
      user.userId,
      year,
      month,
    );
  }

  // 추가된 메소드
  @ApiOperation({
    summary: '유저의 꿈 일기 카테고리별 평균 점수',
    description: '유저의 꿈 일기 카테고리별 평균 점수를 반환합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('categories/score')
  async getUserDreamDiaryScoreAvg(
    @GetUser() user: UserDto,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<DreamDiaryCategoryScoreAvg[]> {
    return this.statService.getUserDreamDiaryScoreAvg(user.userId, year, month);
  }
}
