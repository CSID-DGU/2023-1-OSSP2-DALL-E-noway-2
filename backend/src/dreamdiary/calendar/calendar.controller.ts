import {
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { DreamDiaryFeedDto } from 'src/dto/dreamdiary.feeds.response.dto';
import { CalendarService } from './calendar.service';
import { CalendarListResponseDto } from 'src/dto/calendar.list.response.dto';

@ApiTags('Calendar')
@Controller('dream-diary/calendar')
export class CalendarController {
  private logger = new Logger(CalendarController.name);
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({
    summary: '특정 달의 꿈일기 달력 목록 조회',
    description: '특정 달의 꿈일기 달력 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '특정 달의 꿈일기 달력 목록을 조회에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 문제가 발생한 경우, 400 Bad Request를 반환합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('month-list/:year/:month')
  async getMonthDiaryList(
    @GetUser() user: UserDto,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ): Promise<CalendarListResponseDto> {
    try {
      return await this.calendarService.getMonthDiaryList(
        user.userId,
        year,
        month,
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
    summary: '특정 날의 꿈일기 피드 조회',
    description: '특정 날의 꿈일기 피드를 조회합니다.',
  })
  @ApiOkResponse({
    description: '특정 날의 꿈일기 피드를 조회에 성공합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 문제가 발생한 경우, 400 Bad Request를 반환합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':year/:month/:day')
  async getDreamDiaryFeedByDate(
    @GetUser() user: UserDto,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Param('day', ParseIntPipe) day: number,
  ): Promise<DreamDiaryFeedDto> {
    try {
      return await this.calendarService.getDreamDiaryFeedByDate(
        user.userId,
        year,
        month,
        day,
      );
    } catch (err) {
      this.logger.error(err.message);
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }
}
