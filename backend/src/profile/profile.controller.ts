import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProfileResponseDto } from 'src/dto/profile.response.dto';
import { ProfileService } from './profile.service';
import { ProfileUpdateRequestDto } from 'src/dto/profile.update.request.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/user.decorator';
import { UserDto } from 'src/dto/user.dto';
import { ProfileDetailResponseDto } from 'src/dto/profile.detail.response.dto';
import { DreamDiaryFeedResponseDto } from 'src/dto/profile.feed.response.dto';
import { BoardListResponseDto } from 'src/dto/profile.boardlist.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { User } from 'src/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';

@ApiTags('Profile')
@Controller('users')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

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
      //존재하지 않는 유저(탈퇴한 유저)
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }

      //기타 에러 전체에서 처리
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '해당 유저 프로필 상세 조회',
    description: '해당 userId를 가지는 유저의 프로필 상세 정보를 반환합니다.',
  })
  @Get(':userId/profile-detail')
  @UseGuards(AuthGuard('jwt'))
  async getProfileDetail(
    @Param('userId', ParseIntPipe) userId: number,
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
      '유저의 프로필 정보(프로필 사진, 닉네임, 자기소개)를 수정합니다.',
  })
  @Put(':userId/profile')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = `uploads`;
          if (!existsSync(path)) {
            mkdirSync(path);
          }
          cb(null, path);
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ProfileUpdateRequestDto,
  })
  async updateProfile(
    @GetUser() user: UserDto,
    @UploadedFile() image?: any,
    @Body('nickname') nickname?: string,
    @Body('presentation') presentation?: string,
  ): Promise<ProfileUpdateRequestDto> {
    try {
      let imageUrl: string;

      // if (image) {
      //   imageUrl = `${this.configService.get<string>('beHost')}/${image.path}`;
      // }
      if (image) {
        imageUrl = `${image.path}`;
      }

      const profile = await this.profileService.updateProfile(
        user.userId,
        nickname,
        presentation,
        imageUrl,
      );

      return profile;
    } catch (err) {
      //요청 파라미터가 잘못된 경우
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
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
    @Param('userId', ParseIntPipe) userId: number,
    //default 1
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ) {
    try {
      const followings = await this.profileService.getFollowings(
        userId,
        page,
        length,
      );

      return followings;
    } catch (err) {
      //요청 파라미터가 잘못된 경우
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
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
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('length', ParseIntPipe) length: number,
  ) {
    try {
      const followers = await this.profileService.getFollowers(
        userId,
        page,
        length,
      );

      return followers;
    } catch (err) {
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }

      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '유저 프로필에서 꿈일기 피드 조회',
    description:
      '유저 프로필에서 공개 범위 및 제한된 공개 범위 꿈 일기 피드를 조회합니다.',
  })
  @Get(':userId/dream-diary/feeds')
  @UseGuards(AuthGuard('jwt'))
  async getDreamDiariesByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', ParseIntPipe) currentPage: number,
    @Query('length', ParseIntPipe) length: number,
    @GetUser() user: UserDto,
  ): Promise<DreamDiaryFeedResponseDto> {
    try {
      const responseDto = await this.profileService.getFeeds(
        userId,
        currentPage,
        length,
        user.userId,
      );

      return responseDto;
    } catch (err) {
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @ApiOperation({
    summary: '유저 프로필에서 작성 게시글 조회',
    description:
      '유저 프로필에서 해당 post-type인 공개 범위 게시글을 조회합니다.',
  })
  @Get(':userId/:type/boards')
  @UseGuards(AuthGuard('jwt'))
  async getBoardList(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('type') postType: string,
    @Query('page', ParseIntPipe) currentPage: number,
    @Query('length', ParseIntPipe) length: number,
    @GetUser() user: UserDto,
  ): Promise<BoardListResponseDto> {
    try {
      const responseDto = await this.profileService.getBoardList(
        userId,
        postType,
        currentPage,
        length,
        user.userId,
      );

      return responseDto;
    } catch (err) {
      if (err instanceof TypeError || err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      throw new InternalServerErrorException(err.message);
    }
  }
}
