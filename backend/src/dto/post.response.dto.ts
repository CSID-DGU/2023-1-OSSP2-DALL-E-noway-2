import { ApiProperty } from '@nestjs/swagger';
import { BoardType } from 'src/enum/board.type';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { UserDto } from './user.dto';

export class PostResponseDto {
  @ApiProperty({
    example: 1,
    description: '게시글 ID',
  })
  postId: number;

  @ApiProperty({
    example: {
      userId: 1,
      nickname: 'Dall-e',
      imageUrl: 'https://example.com',
    },
    description: '작성자 정보',
  })
  author: UserDto;

  @ApiProperty({
    example: '옥상에서 떨어지는 꿈',
    description: '제목',
  })
  title: string;

  @ApiProperty({
    example: '달빛이 밝은 밤 어느 빌딩 옥상에서 떨어지는 꿈을 꾸었다.',
    description: '내용',
  })
  content: string;

  @ApiProperty({
    example: 'FREE',
    description: '게시글 종류',
  })
  boardType: BoardType;

  @ApiProperty({
    example: 15,
    description: '조회수',
  })
  viewCount: number;

  @ApiProperty({
    example: '2019-01-02',
    description: '생성일',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2019-01-05',
    description: '최종수정일',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 'https://example.com',
    description: '유저 프로필 이미지 URL',
  })
  image: string;

  @ApiProperty({
    example: 'PRIVATE',
    description: '공개 범위',
  })
  disclosureScope: DisclosureScopeType;
}
