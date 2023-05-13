import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileResponseDto } from 'src/dto/profile.response.dto';
import { ProfileService } from './profile.service';

/**
 * service의 getProfile 메소드를 통해 dto 반환
 */
@Controller('users')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/:userId/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @Param('userId') userId: number,
  ): Promise<ProfileResponseDto> {
    const responseDto = await this.profileService.getProfile(userId);

    return responseDto;
  }
}
