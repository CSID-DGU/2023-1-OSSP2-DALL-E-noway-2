import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentDto } from 'src/dto/comment.dto';
import { CommentRequestDto } from 'src/dto/comment.request.dto';
import { Comment } from 'src/entities/comment.entity';
import { Repository } from 'typeorm';
import { CommentResponseDto } from '../dto/comment.response.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // 조회 기능 / 글의 종류와 글 id를 받아와 해당하는 글의 댓글들을 모두 가져오는 API
  async getAllComments(
    commentRequestDto: CommentRequestDto,
  ): Promise<CommentResponseDto> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.author', 'author')
      .where('comment.filterType = :filterType', {
        filterType: commentRequestDto.filterType,
      })
      .andWhere('comment.id = :id', { id: commentRequestDto.id });

    const comments = await query.getMany();
    const commentDtoArr: CommentDto[] = comments.map((comment) => {
      const commentDto: CommentDto = {
        commentId: comment.commentId,
        id: comment.id,
        content: comment.content,
        filterType: comment.filterType,
        parentCommentId: comment.parentCommentId,
        createdAt: comment.createdAt,
        user: {
          userId: comment.userId,
          nickname: comment.author.nickname,
          imageUrl: comment.author.imageUrl,
        },
      };
      return commentDto;
    });

    const commentResponseDto: CommentResponseDto = {
      comments: commentDtoArr,
    };

    return commentResponseDto;
  }

  // 댓글 생성 기능 / 글의 종류, 글 id, 글 내용을 받아와 해당하는 글에 댓글을 등록하는 API
  async createComment(
    commentRequestDto: CommentRequestDto,
    userId: number,
  ): Promise<Comment> {
    const comment = this.commentRepository.create(commentRequestDto);
    comment.parentCommentId = null;
    comment.createdAt = new Date();
    comment.userId = userId;
    return await this.commentRepository.save(comment);
  }

  // 답글 생성 기능 / 글의 종류, 글 id, 부모 댓글 id를 받아와 답글을 등록하는 API
  async createReply(
    commentRequestDto: CommentRequestDto,
    userId: number,
  ): Promise<Comment> {
    const replyComment = this.commentRepository.create(commentRequestDto);
    replyComment.createdAt = new Date();
    replyComment.userId = userId;

    return await this.commentRepository.save(replyComment);
  }

  // 답글 삭제 기능 / 글의 종류와 글 id를 받아와 해당하는 댓글을 삭제하는 API
  async deleteComment(commentId: number, userId: number) {
    // commentId와 user.userId가 모두 일치하는 레코드를 삭제
    const result = await this.commentRepository
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where('commentId = :commentId', { commentId })
      .andWhere('userId = :userId', { userId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(
        `Can't find CommentId with id ${commentId} and userId ${userId}`,
      );
    }
  }
}
