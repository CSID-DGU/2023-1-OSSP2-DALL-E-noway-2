import { ApiProperty } from '@nestjs/swagger';

export class GeneratedImagesResponseDto {
  @ApiProperty({
    example: 0,
    description: '사용자의 현재 크레딧',
  })
  credits: number;

  @ApiProperty({
    example: 0,
    description: '사용자의 현재 무료 이미지 생성 횟수',
  })
  freeGenerateCount: number;

  @ApiProperty({
    example: 3,
    description: '사용자의 최대 무료 이미지 생성 횟수',
  })
  maxFreeGenerateCount: number;

  @ApiProperty({
    description: '생성된 이미지 Blob 배열',
  })
  generatedImages: Blob[];
}
