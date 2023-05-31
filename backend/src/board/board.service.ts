import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostBookmarkDto } from 'src/dto/post.bookmark.dto';
import { PostLikeDto } from 'src/dto/post.like.dto';
import { PostRequestDto } from 'src/dto/post.request.dto';
import { PostResponseDto } from 'src/dto/post.response.dto';
import { Board } from 'src/entities/board.entity';
import { Bookmark } from 'src/entities/bookmark.entity';
import { Favorite } from 'src/entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,

    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,

    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  // 게시글 생성 기능 / 게시글의 종류와 게시글 내용을 받아와 해당하는 게시판에 게시글을 등록하는 API
  async createPost(postRequestDto: PostRequestDto): Promise<Board> {
    const board = this.boardRepository.create(postRequestDto);
    board.createdAt = new Date();
    return await this.boardRepository.save(board);
  }

  // 게시글 세부내용 조회 기능 / post_id에 해당하는 게시글의 세부사항을 조회하는 API
  async postShow(postId: number): Promise<PostResponseDto> {
    const post = await this.boardRepository.findOne({ where: { postId } });
    if (!post) {
      throw new NotFoundException(`Could not find post with ID ${postId}`);
    }
    const postResponseDto = new PostResponseDto();
    Object.assign(postResponseDto, post);
    return postResponseDto;
  }

  // 게시글 세부내용 수정 기능 / post_id에 해당하는 게시글의 세부사항을 수정하는 API
  async postUpdate(postRequestDto: PostRequestDto) {
    const result = await this.boardRepository.update(
      { postId: postRequestDto.postId },
      {
        title: postRequestDto.title,
        content: postRequestDto.content,
        image: postRequestDto.image,
        updatedAt: new Date(),
        disclosureScope: postRequestDto.disclosureScope,
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        `Could not find post with ID ${postRequestDto.postId}`,
      );
    }
  }

  // 게시글 삭제 기능 // post_id에 해당하는 게시글을 삭제하는 API
  async postDelete(postRequestDto: PostRequestDto) {
    const result = await this.boardRepository
      .createQueryBuilder('board')
      .delete()
      .where('postId = :postId', { postId: postRequestDto.postId })
      .andWhere('userId = :userId', { userId: postRequestDto.userId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(
        `Could not find post with postId, userId / ${postRequestDto.postId}, ${postRequestDto.userId}`,
      );
    } else {
      // 삭제가 성공했다는 말은 해당 게시글이 삭제되었다는 말이므로 해당 게시글의 좋아요, 북마크도 삭제함.
      // 게시글 삭제시 해당 게시글의 좋아요 삭제
      await this.favoriteRepository
        .createQueryBuilder('favorite')
        .delete()
        .where('id = :postId', { postId: postRequestDto.postId })
        .andWhere('userId = :userId', { userId: postRequestDto.userId })
        .execute();

      // 게시글 삭제시 해당 게시글의 좋아요 삭제
      await this.bookmarkRepository
        .createQueryBuilder('bookmark')
        .delete()
        .where('id = :postId', { postId: postRequestDto.postId })
        .andWhere('userId = :userId', { userId: postRequestDto.userId })
        .execute();
    }

    return result;
  }

  // 게시글 좋아요 설정 기능 / 게시글의 ID를 받아와 해당하는 게시글의 좋아요를 설정하는 API
  // 좋아요, 북마크 시 request로 넘어오는 게시글의 id와 type이 옳은지(id에 해당하는 게시글과 id가 일치하지 않을때)는
  // 확인하는 코드는 따로 추가 안해도 괜찮겠죠? 코드라인이 길어지는 것에 비해 불필요한 코드라고 생각해서 생략했습니다.
  async postLike(postLikeDto: PostLikeDto): Promise<Favorite> {
    const board = await this.favoriteRepository.create(postLikeDto);
    board.createdAt = new Date();
    return await this.favoriteRepository.save(board);
  }

  // 게시글 좋아요 취소 기능 // post_id, post_type, userId를 바탕으로 해당 게시글의 좋아요를 취소하는 API
  async postLikeCancel(postLikeDto: PostLikeDto) {
    const result = await this.favoriteRepository.delete(postLikeDto);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Could not find like post with postID, post_type / ${postLikeDto.id},${postLikeDto.filterType}`,
      );
    }
    return result;
  }

  // 게시글 북마크 설정 기능 / post_id, post_type, userId 정보를 바탕으로 해당하는 게시글 즐겨찾기를 설정하는 API
  async postBookmark(postBookmarkDto: PostBookmarkDto): Promise<Bookmark> {
    const board = await this.bookmarkRepository.create(postBookmarkDto);
    board.createdAt = new Date();
    return await this.bookmarkRepository.save(board);
  }

  // 게시글 북마크 취소 기능 // post_id에 해당하는 게시글 즐겨찾기를 취소하는 API
  async postBookmarkCancel(postBookmarkDto: PostBookmarkDto) {
    const result = await this.bookmarkRepository.delete(postBookmarkDto);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Could not find bookmark post with postID, post_type / ${postBookmarkDto.id},${postBookmarkDto.filterType}`,
      );
    }
    return result;
  }
}
