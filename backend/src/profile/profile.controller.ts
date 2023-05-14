import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileResponseDto } from 'src/dto/profile.response.dto';
import { ProfileDetailResponseDto } from 'src/dto/profile.response.dto';
import { ProfileService } from './profile.service';
import { ProfileUpdatetDto } from 'src/dto/profile.update.request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('users')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * service의 getProfile 메소드를 통해
   * user, 팔로잉수, 팔로워수 dto 반환
   */
  @ApiOperation({
    summary: '해당 유저 프로필 조회',
    description:
      '해당 userId를 가지는 유저의 프로필 정보와 팔로잉 수, 팔로워 수를 반환합니다.',
  })
  @Get(':userId/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ProfileResponseDto> {
    try {
      const responseDto = await this.profileService.getProfile(userId);

      return responseDto;
    } catch (err) {
      //요청 파라미터가 잘못된 경우
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      //로그인하지 않은 사용자
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException(err.message);
      }
      //존재하지 않는 유저(탈퇴한 유저)
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }

      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * service의 getProfileDetail 메소드를 통해
   * user의 모든 상세정보 dto 반환
   */
  @ApiOperation({
    summary: '해당 유저 프로필 상세 조회',
    description: '해당 userId를 가지는 유저의 프로필 상세 정보를 반환합니다.',
  })
  @Get(':userId/profile-detail')
  @UseGuards(AuthGuard('jwt'))
  async getProfileDetail(
    @Param('userId') userId: number,
  ): Promise<ProfileDetailResponseDto> {
    try {
      const profileDetailResponseDto: ProfileDetailResponseDto =
        await this.profileService.getProfileDetail(userId);

      return profileDetailResponseDto;
    } catch (err) {
      //요청 파라미터가 잘못된 경우
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      //로그인하지 않은 사용자
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException(err.message);
      }
      //존재하지 않는 유저(탈퇴한 유저)
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }

      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '유저 프로필 수정',
    description:
      '유저의 프로필 정보(프로필 사진,닉네임,자기소개)를 수정합니다.',
  })
  @Put(':userId/profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Param('userId') userId: number,
    @Body() profileUpdatetDto: ProfileUpdatetDto,
  ): Promise<ProfileUpdatetDto> {
    try {
      const profile = await this.profileService.updateProfile(
        userId,
        profileUpdatetDto,
      );

      return profile;
    } catch (err) {
      //요청 파라미터가 잘못된 경우
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      //로그인하지 않은 사용자
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException(err.message);
      }
      //존재하지 않는 유저(탈퇴한 유저)
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }

      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '유저 팔로잉 조회',
    description: '유저의 팔로잉 리스트를 조회합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId/followings')
  async getFollowings(
    //UUID인지 체크
    @Param('userId', new ParseUUIDPipe()) userId: string,
    //default 1
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    //default null
    @Query('nickname', new DefaultValuePipe('')) nickname: string,
  ) {
    try {
      const followings = await this.profileService.getFollowings(
        userId,
        page,
        nickname,
      );

      return followings;
    } catch (err) {
      //요청 파라미터가 잘못된 경우
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      //로그인하지 않은 사용자
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException(err.message);
      }
      //존재하지 않는 유저(탈퇴한 유저)
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }

      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '유저 팔로워 조회',
    description: '유저의 팔로워 리스트를 조회합니다.',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get(':userId/followers')
  async getFollowers(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('nickname', new DefaultValuePipe('')) nickname: string,
  ) {
    try {
      const followers = await this.profileService.getFollowers(
        userId,
        page,
        nickname,
      );

      return followers;
    } catch (err) {
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof UnauthorizedException) {
        throw new UnauthorizedException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }

      throw new InternalServerErrorException(err.message);
    }
  }
}
