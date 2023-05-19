import { ApiProperty } from '@nestjs/swagger';
import { BoardListDto } from './boardlist.dto';

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
}
