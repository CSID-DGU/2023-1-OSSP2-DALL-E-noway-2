import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BoardType } from 'src/enum/board.type';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';

export class PostRequestDto {
  postId: number;

  userId: number;

  @ApiProperty({
    example: '옥상에서 떨어지는 꿈',
    description: '제목',
  })
  title: string;

  @ApiProperty({
    example: '달빛이 밝은 밤 어느 빌딩 옥상에서 떨어지는 꿈을 꾸었다.',
    description: '내용',
  })
  content: string;

  boardType: BoardType;

  @ApiProperty({
    example: 'https://example.com',
    description: '유저 프로필 이미지 URL',
    required: false,
    format: 'binary',
  })
  @Optional()
  image: string;

  @ApiProperty({
    example: 'PRIVATE',
    description: '공개 범위',
  })
  disclosureScope: DisclosureScopeType;
}
