import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CategoryDto,
  CategoryResponseDto,
} from 'src/dto/category.response.dto';
import { Category } from 'src/entities/category.entity';
import { DiaryCategory } from 'src/entities/diary.category.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(DiaryCategory)
    private readonly diaryCategoryRepository: Repository<DiaryCategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategoryList(): Promise<CategoryResponseDto> {
    const categories = await this.categoryRepository.find();

    const categoryList: CategoryDto[] = categories.map((category) => {
      const categoryDto: CategoryDto = {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
      };
      return categoryDto;
    });

    const categoryResponseDto: CategoryResponseDto = {
      categories: categoryList,
    }; //카테고리 목록 반환

    return categoryResponseDto;
  }
}
