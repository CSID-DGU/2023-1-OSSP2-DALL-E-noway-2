import { ApiProperty } from '@nestjs/swagger';
import { FilterType } from 'src/enum/filter.type';

export class CommentRequestDto {
  @ApiProperty({
    example: 'comment content TEST',
  })
  content: string;

  filterType: FilterType;
  id: number;
  parentCommentId: number;
}
