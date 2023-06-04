import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAIService {
  private readonly openAIApi: OpenAIApi;
  private readonly logger = new Logger(OpenAIService.name);
  constructor(@Inject(ConfigService) private configService: ConfigService) {
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION_ID,
    });
    this.openAIApi = new OpenAIApi(config);
  }

  /**
   * OpenAI의 Davinci 엔진을 이용해 해몽을 생성합니다.
   *
   * @param prompt 해몽을 위한 프롬프트
   * @returns 생성된 해몽 결과
   */
  async createDreamInterpretation(content: string): Promise<string> {
    this.logger.debug(`Called ${this.createDreamInterpretation.name}`);

    const response = await this.openAIApi.createCompletion({
      model: 'text-davinci-003',
      prompt:
        content +
        '\n\n이 꿈에 대한 세부적인 설명은 필요 없이 해몽을 알려줘. 대답은 할 필요 없이 "해몽 : "으로 시작해.',
      max_tokens: 1000,
      temperature: 0.4,
      n: 1,
    });

    const interpretation = response.data.choices[0].text.trim();

    return interpretation;
  }
}
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
      // apiKey: process.env.OPENAI_API_KEY,
      // organization: process.env.OPENAI_ORGANIZATION_ID,
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

  /**
   * OpenAI의 Davinci 엔진을 이용해 해몽을 생성합니다.
   *
   * @param prompt 해몽을 위한 프롬프트
   * @returns 생성된 해몽 결과
   */
  async createDreamInterpretation(content: string): Promise<string> {
    this.logger.debug(`Called ${this.createDreamInterpretation.name}`);

    const response = await this.openAIApi.createCompletion({
      model: 'text-davinci-003',
      prompt:
        content +
        '\n\n이 꿈에 대한 세부적인 설명은 필요 없이 해몽을 알려줘. 대답은 할 필요 없이 "해몽 : "으로 시작해.',
      max_tokens: 1000,
      temperature: 0.4,
      n: 1,
    });

    const interpretation = response.data.choices[0].text.trim();

    return interpretation;
  }
}
