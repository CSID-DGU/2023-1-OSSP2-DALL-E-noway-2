import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/user.decorator';
import { PostRequestDto } from 'src/dto/post.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { BoardType } from 'src/enum/board.type';
import { BoardService } from './board.service';

@ApiTags('Board')
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiOperation({
    summary: '기타 게시글 생성',
    description:
      'post_type에 해당하는 게시판에 PostRequestDto에서 받아온 정보를 바탕으로 새로운 게시글을 생성합니다.',
  })
  @Post('/posts/:post_type')
  @UseGuards(AuthGuard('jwt'))
  async createPost(
    @Body() postRequestDto: PostRequestDto,
    @Param('post_type') boardType: BoardType,
    @GetUser() user: UserDto,
  ) {
    postRequestDto.boardType = boardType;
    postRequestDto.userId = user.userId;
    const result = await this.boardService.createPost(postRequestDto);
    return result.postId;
  }
}
