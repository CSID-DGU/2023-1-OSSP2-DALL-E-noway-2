import { ApiProperty } from '@nestjs/swagger';

export class BoardFeedsResponseDto {
  boardFeeds: BoardFeedDto[];
  totalLength: number;
}

export class BoardFeedDto {
  @ApiProperty({
    example: 1,
    description: '게시판 아이디',
  })
  postId: number;
  @ApiProperty({
    example: '게시판 제목입니다.',
    description: '게시판 제목',
  })
  title: string;
  @ApiProperty({
    example: 1,
    description: '조회수',
  })
  viewCount: number;
  @ApiProperty({
    example: 'Dall-e',
    description: '유저 닉네임',
  })
  nickname: string;
  @ApiProperty({
    example: 'https://example.com',
    description: '꿈일기 이미지',
  })
  imageUrl: string;
  @ApiProperty({
    example: '게시판 내용입니다.',
    description: '게시판 내용',
  })
  content: string;
}
