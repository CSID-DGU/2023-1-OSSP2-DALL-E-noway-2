import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetUser } from 'src/decorator/user.decorator';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { FilterType } from 'src/enum/filter.type';
import { CommentService } from './comment.service';
import { CommentResponseDto } from './dto/comment.response.dto';


// comment DB에 내용이 담기는 colum이 없어서 content 필드명으로 테이블에 추가해서 내용 저장해야함!
@Controller('/api/comments')
export class CommentController {
    constructor(private commentService: CommentService) {}

    // 조회 기능 / 글의 종류, 글 id를 받아와 해당하는 글의 댓글들을 모두 가져오는 API
    @Get('/:filter_type/:id')
    async getAllComments(@Param('filter_type') filterType: FilterType, @Param('id') id: number): Promise<Comment[]> {
        return await this.commentService.getAllComments(filterType, id);
    }

    // 댓글 생성 기능 / 글의 종류, 글 id, 글 내용을 받아와 해당하는 글에 댓글을 등록하는 API
    @Post('/:filter_type/:id')
    async createComment(@Body() commentResponseDto:CommentResponseDto,
    @Param('filter_type') filter_type: FilterType,
     @Param('id') id: number,
     @GetUser() user: User,
     ){
        commentResponseDto.filterType = filter_type;
        commentResponseDto.id = id;

        const result = await this.commentService.createComment(commentResponseDto, user);
        return result.commentId; 
    }
}