import { ApiProperty } from '@nestjs/swagger';

export class GenerateDreamDiaryImagesRequestDto {
  @ApiProperty({
    example: '옥상에서 떨어지는 꿈',
    description: '꿈일기 제목',
  })
  title: string;

  @ApiProperty({
    example: 'content',
    description: '꿈일기 내용',
  })
  content: string;

  @ApiProperty({
    example: 3,
    description: '생성할 이미지의 개수',
  })
  n: number;
}
