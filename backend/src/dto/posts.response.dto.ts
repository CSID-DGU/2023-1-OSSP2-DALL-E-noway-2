import { PostResponseDto } from './post.response.dto';

export class PostsResponseDto {
  posts: PostResponseDto[];
  totalLength: number;
}
