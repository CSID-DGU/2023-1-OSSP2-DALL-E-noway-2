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
   * Dalle 모델에게 프롬프트를 제공하기 위해 GPT 모델에게 제시할 프롬프트를 구성합니다.
   * @param title
   * @param content
   * @returns GPT 모델에게 제시할 프롬프트
   */
  constructGPTPromptForDalle(title: string, content: string): string {
    const prompt = `
      다음은 유저가 작성한 꿈 일기의 제목과 내용이야.
      이 일기의 내용을 바탕으로 텍스트를 이미지로 만들어주는 모델에게 적절한 프롬프트를 제시해주려고 해.
      아래 지시사항을 바탕으로 해당 모델에게 제공해줄 프롬프트를 만들어줘.
      1. 꿈 일기의 내용에서 등장하는 가장 주요한 대상을 제시해줘. (사람, 장소, 물체 등)
      2. 꿈 일기의 내용에서 드러나는 감정이나 분위기에 대한 정보를 제시해줘. (고요, 신비, 활기참, 공포 등)
      3. 필요에 따라 꿈 일기 내용에서 발생하는 (움직임, 빛, 음악 등)과 같은 감각적인 요소가 있다면 이를 강조해줘.
      4. 내용을 바탕으로 사진의 구도를 제시해줘.

      # 유저의 일기
      —
      제목: ${title}
      내용: ${content}
      —
      # 답변 형태
      -
      [TARGET]: The main object that appears in the dream diary
      [EMOTION]: The emotion or mood revealed in the dream diary
      [SENSORY ELEMENTS]: the sensory element of the dream diary
      [COMPOSITION]: the composition of the photo based on the content of the dream diary

      ***** 답변은 반드시 영어 500자 이내로 해줘. *****
    `;
    return prompt;
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
   * OpenAI의 텍스트 생성 API를 이용해 답변을 생성합니다.
   * @param prompt GPT 모델에게 제공할 프롬프트
   */
  async createText(prompt: string, model: string): Promise<string> {
    this.logger.debug(`Called ${this.createText.name}`);

    const response = await this.openAIApi.createChatCompletion({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0,
    });
    return response.data.choices[0].message.content.trim();
  }

  /**
   * OpenAI의 Davinci 엔진을 이용해 해몽을 생성합니다.
   *
   * @param title 꿈일기 제목
   * @param content 꿈일기 내용
   * @returns 생성된 해몽 결과
   */
  async createDreamInterpretation(
    title: string,
    content: string,
  ): Promise<string> {
    const response = await this.openAIApi.createCompletion({
      model: 'text-davinci-003',
      prompt:
        '제목은 ' +
        title +
        '이고 내용은 ' +
        content +
        '\n\n이것은 꿈일기이고 이 꿈일기의 꿈에 대한 해몽을 알려줘. 꿈에 대한 요약과 세부적인 설명은 필요 없어. 대답은 할 필요 없이 "해몽 : "으로 시작해. 중복되는 내용이 안들어가게 해줘.',
      max_tokens: 1000,
      temperature: 0.3,
      n: 1,
    });

    const interpretation = response.data.choices[0].text.trim();

    return interpretation;
  }
}
