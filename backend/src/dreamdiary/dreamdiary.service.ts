import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration, OpenAIApi } from 'openai';
import { GeneratedImagesResponseDto } from 'src/dto/generated.images.response.dto';
import { ImageRequests } from 'src/entities/image.requests.entity';
import { User } from 'src/entities/user.entity';
import { OpenAIService } from 'src/util/openai.service';
import { Repository } from 'typeorm';

@Injectable()
export class DreamDiaryService {
  private readonly logger = new Logger(DreamDiaryService.name);

  constructor(
    private readonly oepnAIService: OpenAIService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ImageRequests)
    private readonly imageRequestsRepository: Repository<ImageRequests>,
  ) {}

  async getUserWithImageRequestsInfo(userId: number): Promise<User> {
    this.logger.debug(`Called ${this.getUserWithImageRequestsInfo.name}`);

    const result = await this.userRepository.findOne({
      where: {
        userId,
      },
      relations: ['imageRequests'],
    });
    console.log(result.imageRequests.curRequestCount);
    console.log(result.imageRequests.maxRequestCount);
    console.log(result.credits);
    return result;
  }

  async createDreamDiaryImages(
    title: string,
    content: string,
    userId: number,
  ): Promise<GeneratedImagesResponseDto> {
    this.logger.debug(`Called ${this.createDreamDiaryImages.name}`);

    const result = await this.getUserWithImageRequestsInfo(userId);
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
      await this.userRepository.update(
        {
          userId,
        },
        {
          credits,
        },
      );
    } else {
      ++curRequestCount;
      await this.imageRequestsRepository.update(
        {
          userId,
        },
        {
          curRequestCount,
        },
      );
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

    const images = await this.oepnAIService.createImage(prompt, 1, '512x512');

    return {
      credits,
      freeGenerateCount: curRequestCount,
      maxFreeGenerateCount: maxRequestCount,
      generatedImages: images,
    } as GeneratedImagesResponseDto;
  }
}
