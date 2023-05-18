import { ApiProperty } from "@nestjs/swagger";
import { BoardListDto } from "./boardlist.dto";

export class BoardListResponseDto {
    @ApiProperty({
      type: [BoardListDto],
      description: '게시글 목록',
    })
    boardList: BoardListDto[];
  
    @ApiProperty({
      example: 10,
      description: '게시글 목록의 총 길이',
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