import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration, OpenAIApi } from 'openai';
import { GeneratedImagesResponseDto } from 'src/dto/generated.images.response.dto';
import { DreamDiary } from 'src/entities/dream.diary.entity';
import { UserService } from 'src/user/user.service';
import { OpenAIService } from 'src/util/openai.service';
import { Repository } from 'typeorm';

@Injectable()
export class DreamDiaryService {
  private readonly logger = new Logger(DreamDiaryService.name);

  constructor(
    private readonly openAIService: OpenAIService,
    private readonly userService: UserService,
    @InjectRepository(DreamDiary)
    private readonly dreamDiaryRepository: Repository<DreamDiary>,
  ) {}

  async createDreamDiaryImages(
    title: string,
    content: string,
    userId: number,
  ): Promise<GeneratedImagesResponseDto> {
    this.logger.debug(`Called ${this.createDreamDiaryImages.name}`);

    const result = await this.userService.getUserWithImageRequestsInfo(userId);
    const maxRequestCount = result.imageRequests.maxRequestCount;
    let curRequestCount = result.imageRequests.curRequestCount;
    let credits = result.credits;

    if (curRequestCount + 1 > maxRequestCount) {
      if (credits <= 0) {
        throw new ForbiddenException(
          '무료 이미지 생성 횟수를 초과했습니다. 추가로 이용하시려면 크레딧을 충전해주세요.',
        );
      }
      --credits;
      await this.userService.updateUserCredits(userId, credits);
    } else {
      ++curRequestCount;
      await this.userService.updateUserCurRequestCount(userId, curRequestCount);
    }

    // TODO: prompt를 어떻게 만들어야 할지 고민해보기
    // FIXME: GPT가 만들어주는 프롬프트로 받아서 사용해야 함.
    title;
    content;
    const prompt = `
    Captures two individuals in the office, one of them pointing a gun at the other.
    Portray a sense of mystery and suspense.
    Take a medium-close shot from a slightly elevated angle, providing a partial overhead view.
    Use dim, atmospheric lighting with soft shadows. Illuminate the subject from a single source, casting intriguing highlights and shadows.
    Create a moody ambiance with artificial lighting. Employ warm, low-intensity light resembling evening or late-night illumination.
    Employ a wide-angle lens to capture the entire scene, providing a broader perspective.
    Set the scene inside a corporate office, giving a sense of a real-world environment.
    Use a digital process to enhance the image and maintain control over lighting and composition.
    This photo could be used in a suspense or mystery-themed publication, a corporate thriller, or a psychological drama.
`;

    // const images = await this.oepnAIService.createImage(prompt, 1, '512x512');
    const images = [
      'https://avatars.githubusercontent.com/u/31301280?s=200&v=4splash.com/photo-1621574539437-4b5b5b5b5b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjI0NjB8MHwxfHNlYXJjaHwxfHxkcmVhbXN0aW9ufGVufDB8fHx8MTYyMjE0NjY5Mg&ixlib=rb-1.2.1&q=80&w=1080',
    ];

    return {
      credits,
      freeGenerateCount: curRequestCount,
      maxFreeGenerateCount: maxRequestCount,
      generatedImages: images,
    } as GeneratedImagesResponseDto;
  }

  async createDreamInterpretation(diaryId: number) {
    this.logger.debug(`Called ${this.createDreamInterpretation.name}`);

    const dreamDiary = await this.dreamDiaryRepository.findOne({
      where: { diaryId: diaryId },
    });

    const interpretation = await this.openAIService.createDreamInterpretation(
      dreamDiary.title,
      dreamDiary.content,
    );

    dreamDiary.interpretation = interpretation;

    await this.dreamDiaryRepository.save(dreamDiary);
    return interpretation;
  }
}
