import {
  Body,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/decorator/user.decorator';
import { GenerateDreamDiaryImagesRequestDto } from 'src/dto/generate.dreamdiary.images.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { DreamDiaryService } from './dreamdiary.service';
import { AuthGuard } from '@nestjs/passport';
import { GeneratedImagesResponseDto } from 'src/dto/generated.images.response.dto';

@ApiTags('DreamDiary')
@Controller('dream-diary')
export class DreamDiaryController {
  private readonly logger = new Logger(DreamDiaryController.name);
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
  @UseGuards(AuthGuard('jwt'))
  async createDreamDiaryImages(
    @Body(new ValidationPipe())
    generateDreamDiaryImagesRequestDto: GenerateDreamDiaryImagesRequestDto,
    @GetUser() user: UserDto,
  ): Promise<GeneratedImagesResponseDto> {
    try {
      return await this.dreamDiaryService.createDreamDiaryImages(
        generateDreamDiaryImagesRequestDto.title,
        generateDreamDiaryImagesRequestDto.content,
        user.userId,
      );
    } catch (err) {
      this.logger.error(err.message);
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '해몽 생성',
    description: '해당 다이어리 내용의 해몽을 저장합니다.',
  })
  @Put(':id/interpretation')
  async createDreamInterpretation(@Param('id') diaryId: number) {
    const interpretation =
      await this.dreamDiaryService.createDreamInterpretation(diaryId);
    return { interpretation };
  }
}
