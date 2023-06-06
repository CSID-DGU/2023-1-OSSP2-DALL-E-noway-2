import { Controller, Get } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryResponseDto } from 'src/dto/category.response.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: '꿈일기 카테고리 목록',
    description: '꿈일기 카테고리 목록을 보여줍니다.',
  })
  @ApiCreatedResponse({ description: '꿈일기 카테고리 목록을 조회합니다.' })
  @ApiBadRequestResponse({ description: '잘못된 요청입니다.' })
  @Get('category-list')
  async getCategoryList(): Promise<CategoryResponseDto> {
    const categoryList = await this.categoryService.getCategoryList();

    return categoryList;
  }
}
