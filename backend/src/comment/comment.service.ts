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
}