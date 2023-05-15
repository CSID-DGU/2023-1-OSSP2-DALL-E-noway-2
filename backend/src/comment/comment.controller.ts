import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/decorator/user.decorator';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { FilterType } from 'src/enum/filter.type';
import { CommentService } from './comment.service';
import { CommentResponseDto } from '../dto/comment.response.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  ): Promise<Comment[]> {
    return await this.commentService.getAllComments(filterType, id);
  }

  @ApiOperation({
    summary: '댓글 생성',
    description:
      '글의 종류, 글 id, 글 내용을 받아와 해당하는 글에 댓글을 등록합니다.',
  })
  @Post('/:filter_type/:id')
  async createComment(
    @Body() commentResponseDto: CommentResponseDto,
    @Param('filter_type') filter_type: FilterType,
    @Param('id') id: number,
    @GetUser() user: User,
  ) {
    commentResponseDto.filterType = filter_type;
    commentResponseDto.id = id;

    const result = await this.commentService.createComment(
      commentResponseDto,
      user,
    );
    return result.commentId;
  }

  @ApiOperation({
    summary: '답글 생성',
    description: '글의 종류, 글 id, 부모 댓글 id를 받아와 답글을 등록합니다.',
  })
  @Post('/:filter_type/:id/:comment_id')
  async createReply(
    @Body() commentResponseDto: CommentResponseDto,
    @Param('filter_type') filter_type: FilterType,
    @Param('id') id: number,
    @Param('comment_id') comment_id: number,
    @GetUser() user: User,
  ) {
    commentResponseDto.filterType = filter_type;
    commentResponseDto.id = id;
    commentResponseDto.parentCommentId = comment_id;
    const result = await this.commentService.createReply(
      commentResponseDto,
      user,
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
  async deleteComment(@Param('comment_id') commentId: number) {
    return await this.commentService.deleteComment(commentId);
  }
}
