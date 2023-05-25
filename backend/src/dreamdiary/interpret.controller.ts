import { Controller, Get, Param } from '@nestjs/common';
import { DreamDiaryService } from './interpret.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('DreamDiary')
@Controller('dream-diary')
export class DreamDiaryController {
  constructor(private readonly dreamDiaryService: DreamDiaryService) {}

  @ApiOperation({
    summary: '해몽 생성',
    description: '해당 다이어리 내용의 해몽을 반환합니다.',
  })
  @Get(':id/interpretation')
  async createDreamInterpretation(@Param('id') diaryId: number) {
    const interpretation =
      await this.dreamDiaryService.createDreamInterpretation(diaryId);
    return { interpretation };
  }
}
