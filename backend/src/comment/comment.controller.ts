import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { FilterType } from 'src/enum/filter.type';
import { CommentService } from './comment.service';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentRequestDto } from 'src/dto/comment.request.dto';
import { UserDto } from 'src/dto/user.dto';
import { GetUser } from 'src/decorator/user.decorator';
import { AuthGuard } from '@nestjs/passport';

// comment DB에 내용이 담기는 colum이 없어서 content 필드명으로 테이블에 추가해서 내용 저장해야함!
@ApiTags('Comment')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({
    summary: '댓글 조회',
    description:
      '글의 종류, 글 id를 받아와 해당하는 글의 댓글들을 모두 가져옵니다.',
  })
  @Get('/:filter_type/:id')
  async getAllComments(
    @Param('filter_type') filterType: FilterType,
    @Param('id') id: number,
  ): Promise<CommentResponseDto> {
    const commentRequestDto = new CommentRequestDto();
    commentRequestDto.filterType = filterType;
    commentRequestDto.id = id;

    return await this.commentService.getAllComments(commentRequestDto);
  }

  @ApiOperation({
    summary: '댓글 생성',
    description:
      '글의 종류, 글 id, 글 내용을 받아와 해당하는 글에 댓글을 등록합니다.',
  })
  @Post('/:filter_type/:id')
  @UseGuards(AuthGuard('jwt'))
  async createComment(
    @Body() commentRequestDto: CommentRequestDto,
    @Param('filter_type') filter_type: FilterType,
    @Param('id') id: number,
    @GetUser() user: UserDto,
  ) {
    commentRequestDto.filterType = filter_type;
    commentRequestDto.id = id;

    const result = await this.commentService.createComment(
      commentRequestDto,
      user.userId,
    );
    return result.commentId;
  }

  @ApiOperation({
    summary: '답글 생성',
    description: '글의 종류, 글 id, 부모 댓글 id를 받아와 답글을 등록합니다.',
  })
  @Post('/:filter_type/:id/:comment_id')
  @UseGuards(AuthGuard('jwt'))
  async createReply(
    @Body() commentRequestDto: CommentRequestDto,
    @Param('filter_type') filter_type: FilterType,
    @Param('id') id: number,
    @Param('comment_id') comment_id: number,

    @GetUser() user: UserDto,
  ) {
    commentRequestDto.filterType = filter_type;
    commentRequestDto.id = id;
    commentRequestDto.parentCommentId = comment_id;
    const result = await this.commentService.createReply(
      commentRequestDto,
      user.userId,
    );
    return {
      comment_id: result.commentId,
      parent_comment_id: result.parentCommentId,
    };
  }

  @ApiOperation({
    summary: '댓글 삭제',
    description:
      '글의 종류, 글 id, 댓글 id를 받아와 해당하는 댓글을 삭제합니다.',
  })
  @Delete('/:filter_type/:id/:comment_id')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(
    @Param('comment_id') commentId: number,
    @GetUser() user: User,
  ) {
    return await this.commentService.deleteComment(commentId, user.userId);
  }
}
