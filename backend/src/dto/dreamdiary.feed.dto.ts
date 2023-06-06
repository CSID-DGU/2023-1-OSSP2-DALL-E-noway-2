import { ApiProperty } from '@nestjs/swagger';

export class DreamDiaryFeedDto {
  @ApiProperty({
    example: 1,
    description: '다이어리 아이디',
  })
  diaryId: number;

  @ApiProperty({
    example: '다이어리 제목',
    description: '다이어리 제목',
  })
  title: string;

  @ApiProperty({
    example: '옥상에서 떨어지는 꿈을 꿨어요...',
    description: '꿈일기 내용',
  })
  content: string;

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
  diaryImageUrl: string;
}
