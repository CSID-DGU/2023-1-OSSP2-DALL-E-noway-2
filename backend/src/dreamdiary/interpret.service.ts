import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { OpenAIService } from 'src/util/openai.service';
import { Repository } from 'typeorm';

@Injectable()
export class DreamDiaryService {
  private readonly logger = new Logger(DreamDiaryService.name);

  constructor(
    private readonly openAIService: OpenAIService,
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
  ) {}

  async createDreamInterpretation(diaryId: number) {
    this.logger.debug(`Called ${this.createDreamInterpretation.name}`);

    const dreamDiary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    });

    const interpretation = await this.openAIService.createDreamInterpretation(
      dreamDiary.content,
    );
    return interpretation;
  }
}
