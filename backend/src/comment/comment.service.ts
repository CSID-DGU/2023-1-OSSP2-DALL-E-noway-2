import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { FilterType } from 'src/enum/filter.type';
import { Repository } from 'typeorm';
import { CommentResponseDto } from './dto/comment.response.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
    ) {}

    // 조회 기능 / 글의 종류와 글 id를 받아와 해당하는 글의 댓글들을 모두 가져오는 API
    async getAllComments(filterType: FilterType, id: number): Promise <Comment[]> {
        const query = this.commentRepository.createQueryBuilder('comment')
        .where('comment.filterType = :filterType', {filterType})
        .andWhere('comment.id = :id', {id});

        const comments = await query.getMany();
        return comments;
    }

    // 댓글 생성 기능 / 글의 종류, 글 id, 글 내용을 받아와 해당하는 글에 댓글을 등록하는 API
    async createComment(commentResponseDto:CommentResponseDto, user: User): Promise <Comment> {
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
}