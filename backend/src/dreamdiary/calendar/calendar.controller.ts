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
import { DreamDiaryService } from '../dreamdiary.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { DreamDiaryFeedDto } from 'src/dto/dreamdiary.feeds.response.dto';

@ApiTags('Calendar')
@Controller('dream-diary/calendar')
export class CalendarController {
  private logger = new Logger(CalendarController.name);
  constructor(private readonly dreamDiaryService: DreamDiaryService) {}

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
  @Get('calendar/:year/:month/:day')
  async getDreamDiaryFeedByDate(
    @GetUser() user: UserDto,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Param('day', ParseIntPipe) day: number,
  ): Promise<DreamDiaryFeedDto> {
    try {
      return await this.dreamDiaryService.getDreamDiaryFeedByDate(
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
