import { ApiProperty } from "@nestjs/swagger";

export class BoardListDto {
    @ApiProperty({
      example: 1,
      description: '게시글 아이디',
    })
    postId: number;
  
    @ApiProperty({
      example: '제목1',
      description: '게시글 제목',
    })
    title: string;
  
    @ApiProperty({
      example: '0',
      description: '조회수',
    })
    viewCount: number;
  
    @ApiProperty({
      example: '닉네임1',
      description: '유저 닉네임',
    })
    nickname: string;
  
    @ApiProperty({
      example: 'https://example.com',
      description: '유저 프로필 이미지 URL',
    })
    boardImageUrl: string;
  }