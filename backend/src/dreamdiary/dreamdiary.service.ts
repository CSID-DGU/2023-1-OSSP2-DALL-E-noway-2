import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';
import { OpenAIService } from 'src/util/openai.service';

@Injectable()
export class DreamDiaryService {
  private readonly logger = new Logger(DreamDiaryService.name);

  constructor(private readonly oepnAIService: OpenAIService) {}

  async createDreamDiaryImages(title: string, content: string, userId: number) {
    this.logger.debug(`Called ${this.createDreamDiaryImages.name}`);

    // TODO: prompt를 어떻게 만들어야 할지 고민해보기
    // FIXME: GPT가 만들어주는 프롬프트로 받아서 사용해야 함.
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

    const blobImages = await this.oepnAIService.createImage(
      prompt,
      1,
      '512x512',
    );
  }
}
