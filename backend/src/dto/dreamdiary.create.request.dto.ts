import { ApiProperty } from '@nestjs/swagger';
import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';

export class CategoryResponseDto {
  categories: CategoryDto[];
}

export class CategoryDto {
  categoryId: number;
  categoryName: string;
}

export class DreamDiaryCreateRequestDto {
  @ApiProperty({
    example: '옥상에서 떨어지는 꿈',
    description: '꿈일기 제목',
  })
  title: string;
  @ApiProperty({
    example: '악몽',
    description: '꿈일기 카테고리',
  })
  category: CategoryDto;
  @ApiProperty({
    example: 3,
    description: '꿈 점수',
  })
  dreamScore: number;
  @ApiProperty({
    example: 'formData',
    description: '프로필 이미지',
  })
  imageUrl?: FormData;
  @ApiProperty({
    example: 'disclosureScope',
    description: '제한범위',
  })
  disclosureScope: DisclosureScopeType;
  @ApiProperty({
    example: 'content',
    description: '꿈일기 내용',
  })
  content: string;
}
