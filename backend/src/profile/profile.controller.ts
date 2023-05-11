import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorator/user.decorator';
import { ProfileResponseDto } from 'src/dto/profile.response.dto';
import { UserDto } from 'src/dto/user.dto';

//ProfileResponseDto 객체를 반환하는 메소드
@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() user: any): Promise<ProfileResponseDto> {
    const userDto = new UserDto();
    userDto.userId = user.id;
    userDto.nickname = user.nickname;
    userDto.imageUrl = 'http://example.com';

    //user객체의 followers, following 배열의 길이는 팔로워, 팔로잉 수
    const followerCount = await user.followers.length;
    const followingCount = await user.following.length;

    //responseDto는 반환할 ProfileResponseDto를 저장할 객체
    const responseDto = new ProfileResponseDto();
    responseDto.user = userDto;
    responseDto.followerCount = followerCount;
    responseDto.followingCount = followingCount;

    console.log(responseDto);
    return responseDto;
  }
}
