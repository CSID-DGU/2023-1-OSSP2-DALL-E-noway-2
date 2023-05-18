import { ApiProperty } from '@nestjs/swagger';

export class DreamDiaryFeedsResponseDto {
  dreamDiaryFeeds: DreamDiaryFeedDto[];
  totalLength: number;
}

export class DreamDiaryFeedDto {
  @ApiProperty({
    example: 1,
    description: '꿈일기 아이디',
  })
  diaryId: number;
  @ApiProperty({
    example: '옥상에서 떨어지는 꿈',
    description: '꿈일기 제목',
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
}
