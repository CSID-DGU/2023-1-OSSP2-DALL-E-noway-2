import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, CreateImageRequestSizeEnum, OpenAIApi } from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openAIApi: OpenAIApi;
  private readonly logger = new Logger(OpenAIService.name);
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    const config = new Configuration({
      apiKey: this.configService.get<string>('openai.apiKey'),
      organization: this.configService.get<string>('openai.organizationID'),
    });
    this.openAIApi = new OpenAIApi(config);
  }

  /**
   * OpenAI의 Dalle API를 이용해 이미지를 생성합니다.
   *
   * @param prompt dalle에게 제공될 prompt
   * @param n 생성할 이미지의 개수
   * @param size 이미지 사이즈 (256x256, 512x512, 1024x1024)
   * @returns 생성된 이미지의 URL 배열
   */
  async createImage(
    prompt: string,
    n: number,
    size: CreateImageRequestSizeEnum,
  ): Promise<string[]> {
    this.logger.debug(`Called ${this.createImage.name}`);
    const response = await this.openAIApi.createImage({
      prompt,
      n,
      size,
      response_format: 'url',
    });
    return response.data.data.map((data) => data.url);
  }
}
