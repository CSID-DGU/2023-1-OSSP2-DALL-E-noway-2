import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  categories: CategoryDto[]; //category List
}

export class CategoryDto {
  @ApiProperty({
    example: 1,
    description: '카테고리 아이디',
  })
  categoryId: number; //categoryName 의 Id
  @ApiProperty({
    example: '악몽',
    description: '카테고리 명',
  })
  categoryName: string;
}
