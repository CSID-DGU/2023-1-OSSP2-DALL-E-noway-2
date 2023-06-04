import { ApiProperty } from '@nestjs/swagger';
import { FilterType } from 'src/enum/filter.type';

export class PostBookmarkDto {
  @ApiProperty({
    example: '1',
    description: '게시글 ID',
  })
  id: number;

  @ApiProperty({
    example: '수면 팁 게시판',
    description: '게시판 종류',
  })
  filterType: FilterType;

  @ApiProperty({
    example: '9',
    description: '유저 ID',
  })
  userId: number;
}
