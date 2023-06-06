import { ApiProperty } from '@nestjs/swagger';
import { FilterType } from 'src/enum/filter.type';
import { commentUserResponseDto } from './comment.user.response.dto';

export class CommentDto {
  @ApiProperty({
    example: 1,
    description: '댓글 id',
  })
  commentId: number;

  @ApiProperty({
    example: 1,
    description: 'diary_id or board_id',
  })
  id: number;

  @ApiProperty({
    example: 'comment content TEST',
    description: '댓글 내용',
  })
  content: string;

  @ApiProperty({
    example: 'FREE',
    description: '댓글이 달린 글의 종류',
  })
  filterType: FilterType;

  @ApiProperty({
    description: '부모 댓글 id',
  })
  parentCommentId: number;

  @ApiProperty({
    description: '댓글 생성 시간',
  })
  createdAt: Date;

  @ApiProperty({
    description: '댓글 작성자 정보',
  })
  user: commentUserResponseDto;
}
