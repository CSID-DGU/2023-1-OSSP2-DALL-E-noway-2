import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import { firstValueFrom, map } from 'rxjs';

@Controller('test')
export class TestController {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  @Get()
  async getHello(): Promise<string> {
    const url = this.configService.get<string>('openai.host');
    console.log(url);
    console.log(`${this.configService.get<string>('openai.apiKey')}`);
    console.log(this.configService.get<string>('openai.organizationID'));
    const config = new Configuration({
      organization: `${this.configService.get<string>(
        'openai.organizationID',
      )}`,
      apiKey: `${this.configService.get<string>('openai.apiKey')}`,
    });
    const openai = new OpenAIApi(config);
    const response = await openai.createImage({
      prompt: `
      Captures two individuals in the office, one of them pointing a gun at the other.
      Portray a sense of mystery and suspense.
      Take a medium-close shot from a slightly elevated angle, providing a partial overhead view.
      Use dim, atmospheric lighting with soft shadows. Illuminate the subject from a single source, casting intriguing highlights and shadows.
      Create a moody ambiance with artificial lighting. Employ warm, low-intensity light resembling evening or late-night illumination.
      Employ a wide-angle lens to capture the entire scene, providing a broader perspective.
      Set the scene inside a corporate office, giving a sense of a real-world environment.
      Use a digital process to enhance the image and maintain control over lighting and composition.
      This photo could be used in a suspense or mystery-themed publication, a corporate thriller, or a psychological drama.
`,
      n: 1,
      size: '512x512',
    });
    console.log(response.data);
    return 'Hello World!';
  }
}
