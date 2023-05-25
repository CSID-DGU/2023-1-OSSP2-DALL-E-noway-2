export class CategoryResponseDto {
  categories: CategoryDto[]; //category List
}

export class CategoryDto {
  categoryId: number; //categoryName 의 Id
  categoryName: string;
}
