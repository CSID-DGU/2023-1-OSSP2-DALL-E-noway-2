import { FilterType } from 'src/enum/filter.type';

// 테이블에 content 추가해야함.
export class CommentDto {
  commentId: number;
  id: number;
  content: string;
  filterType: FilterType;
  parentCommentId: number;
  createdAt: Date;
  userId: number;
}
