import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetUser } from 'src/decorator/user.decorator';
import { GenerateDreamDiaryImagesRequestDto } from 'src/dto/generate.dreamdiary.images.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { DreamDiaryService } from './dreamdiary.service';

@Controller('dream-diary')
export class DreamDiaryController {
  constructor(private readonly dreamDiaryService: DreamDiaryService) {}

  @ApiOperation({
    summary: '꿈일기 이미지 생성',
    description:
      '꿈일기 이미지 생성합니다. 하루에 최대 3번까지만 무료로 생성할 수 있습니다.',
  })
  @ApiBody({ type: GenerateDreamDiaryImagesRequestDto })
  @ApiCreatedResponse({
    description:
      '꿈일기 이미지 생성에 성공합니다. 응답으로 생성된 Blob 이미지 배열과 남은 생성 가능 횟수를 반환합니다.',
  })
  @ApiBadRequestResponse({
    description: '문법적인 문제가 발생한 경우, 400 Bad Request를 반환합니다.',
  })
  @ApiForbiddenResponse({
    description:
      '무료 이미지 생성 횟수를 초과한 경우, 403 Forbidden을 반환합니다.',
  })
  @Post('dream-images')
  async createDreamDiaryImages(
    @Body(new ValidationPipe())
    generateDreamDiaryImagesRequestDto: GenerateDreamDiaryImagesRequestDto,
    @GetUser() user: UserDto,
  ) {
    try {
      // 서비스에서 처리하는게 좋으려나..?
      // TODO: 무료 이미지 생성 횟수, 최대 무료 생성 가능 횟수를 얻어온다.
      // FIXME: 실제 받아오는 데이터로 변경해야 함.
      const freeGenerateCount = 0;
      const maxFreeGenerateCount = 3;

      // TODO: 무료 생성 횟수를 초과했다면, 유저의 크레딧 정보를 얻어온다.
      // TODO: 크레딧도 없다면 에러를 반환한다.
      const credits = 1;
      if (credits <= 0) {
        throw new ForbiddenException(
          '무료 이미지 생성 횟수를 초과했습니다. 추가로 이용하시려면 크레딧을 충전해주세요.',
        );
      }

      const generatedImages =
        await this.dreamDiaryService.createDreamDiaryImages(
          generateDreamDiaryImagesRequestDto.title,
          generateDreamDiaryImagesRequestDto.content,
          user.userId,
        );

      return {
        credits,
        freeGenerateCount,
        maxFreeGenerateCount,
        generatedImages,
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
