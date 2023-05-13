import { FilterType } from "src/enum/filter.type";

export class CommentResponseDto {
    commentId: number;
    id: number;
    content: string;
    filterType: FilterType
    parentCommentId: number;
    createdAt: Date;
    userId: number;
}