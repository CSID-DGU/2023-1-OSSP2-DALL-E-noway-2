import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreditInfoResponseDto } from 'src/dto/credit.info.response.dto';
import { UserService } from './user.service';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}
  @ApiOperation({
    summary: '사용자의 크레딧 정보 조회',
    description:
      '사용자의 크레딧 정보를 반환합니다. 응답으로 사용자의 현재 크레딧, 현재 무료 이미지 생성 횟수, 최대 무료 이미지 생성 횟수를 반환합니다.',
  })
  @Get('credit-info')
  @UseGuards(AuthGuard('jwt'))
  async createDreamDiaryImages(
    @GetUser() user: UserDto,
  ): Promise<CreditInfoResponseDto> {
    this.logger.debug(`Called ${this.createDreamDiaryImages.name}`);
    const result = await this.userService.getUserWithImageRequestsInfo(
      user.userId,
    );
    return {
      creditInfo: {
        credits: result.credits,
        freeGenerateCount: result.imageRequests.curRequestCount,
        maxFreeGenerateCount: result.imageRequests.maxRequestCount,
      },
    } as CreditInfoResponseDto;
  }

  @ApiOperation({
    summary: '자기 자신의 정보 조회',
    description: '사용자의 정보를 반환합니다.',
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@GetUser() user: UserDto): Promise<UserDto> {
    this.logger.debug(`Called ${this.getMe.name}`);
    return await this.userService.getUserInfo(user.userId);
  }
}
