import { ApiProperty } from "@nestjs/swagger";
import { DreamDiaryFeedDto } from "./dreamdiary.feed.dto";

/**
 * 프로필에 표시될 유저의 PUBLIC 또는 LIMITED_PUBLIC 범위의 다이어리 목록를 반환하는 DTO입니다.
 */
export class DreamDiaryFeedResponseDto {
    @ApiProperty({
      type: [DreamDiaryFeedDto],
      description: '다이어리 목록',
    })
    dreamDiaryFeeds: DreamDiaryFeedDto[];
  
    @ApiProperty({
      example: 10,
      description: '다이어리 목록의 총 길이',
    })
    totalLength: number;
  
    @ApiProperty({
      example: true,
      description: '다음 페이지 존재 여부',
    })
    hasNextPage: boolean;
  
    @ApiProperty({
      example: true,
      description: '이전 페이지 존재 여부',
    })
    hasPrevPage: boolean;
  }