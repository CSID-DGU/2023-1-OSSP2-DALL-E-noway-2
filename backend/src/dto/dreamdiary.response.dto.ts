import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DreamDiaryResponseDto {
  @ApiProperty({
    example: 123,
    description: '꿈일기 아이디',
  })
  diaryId: number;
  @ApiProperty({
    example: '옥상에서 떨어지는 꿈',
    description: '꿈일기 제목',
  })
  title: string;
  @ApiProperty({
    example: '특정 건물에서 떨어졌습니다.',
    description: '꿈일기 내용',
  })
  content: string;
  @ApiProperty({
    example: '악몽',
    description: '꿈일기 카테고리',
  })
  category: string[];
  @ApiProperty({
    example: 4,
    description: '꿈일기 점수',
  })
  dreamScore: number;
  @ApiProperty({
    example: 25,
    description: '꿈일기 조회수',
  })
  viewCount: number;
  @ApiProperty({
    type: UserDto,
    description: '꿈일기 작성자 정보',
  })
  user: UserDto;
  @ApiProperty({
    type: Date,
    description: '꿈일기 생성날짜',
  })
  createdAt: Date;
  @ApiProperty({
    example: 'https://example.com',
    description: '꿈일기 아이디',
  })
  diaryImageUrl: string;
  @ApiProperty({
    example: DisclosureScopeType.PUBLIC,
    description: '꿈일기 아이디',
  })
  disclosureScope: DisclosureScopeType;
}
