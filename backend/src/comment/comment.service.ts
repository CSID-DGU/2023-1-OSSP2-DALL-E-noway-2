import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { FilterType } from 'src/enum/filter.type';
import { Repository } from 'typeorm';
import { CommentResponseDto } from '../dto/comment.response.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // 조회 기능 / 글의 종류와 글 id를 받아와 해당하는 글의 댓글들을 모두 가져오는 API
  async getAllComments(filterType: FilterType, id: number): Promise<Comment[]> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.filterType = :filterType', { filterType })
      .andWhere('comment.id = :id', { id });

    const comments = await query.getMany();
    return comments;
  }

  // 댓글 생성 기능 / 글의 종류, 글 id, 글 내용을 받아와 해당하는 글에 댓글을 등록하는 API
  async createComment(
    commentResponseDto: CommentResponseDto,
    user: User,
  ): Promise<Comment> {
    // const comment = new Comment()
    // comment.id = commentResponseDto.id;
    // comment.content = commentResponseDto.content;
    // comment.filterType = commentResponseDto.filterType;
    // comment.parentCommentId = null;
    // comment.createdAt = new Date();
    // comment.userId = user.userId;
    // return await this.commentRepository.save(comment); //아래와 같이 간략화할 수 있지만 확실하진 않아서 주석처리

    const comment = this.commentRepository.create(commentResponseDto);
    comment.parentCommentId = null;
    comment.createdAt = new Date();
    comment.userId = user.userId;
    return await this.commentRepository.save(comment);
  }

  // 답글 생성 기능 / 글의 종류, 글 id, 부모 댓글 id를 받아와 답글을 등록하는 API
  async createReply(
    commentResponseDto: CommentResponseDto,
    user: User,
  ): Promise<Comment> {
    // const replyComment = new Comment();
    // replyComment.id = commentResponseDto.id;
    // replyComment.content = commentResponseDto.content;
    // replyComment.filterType = commentResponseDto.filterType;
    // replyComment.parentCommentId = commentResponseDto.parentCommentId;
    // replyComment.createdAt = new Date();
    // replyComment.userId = user.userId;
    // return await this.commentRepository.save(replyComment);//아래와 같이 간략화할 수 있지만 확실하진 않아서 주석처리

    const replyComment = this.commentRepository.create(commentResponseDto);
    replyComment.createdAt = new Date();
    replyComment.userId = user.userId;

    return await this.commentRepository.save(replyComment);
  }

  // 답글 삭제 기능 / 글의 종류와 글 id를 받아와 해당하는 댓글을 삭제하는 API
  async deleteComment(commentId: number) {
    const result = await this.commentRepository.delete(commentId);

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find CommentId with id ${commentId}`);
    }
    //console.log('result', result);
  }
}
