import type { Category } from '..';
import type { DisclosureScopeType } from '../enum/disclosure.scope';

export interface CategoryResponseDto {
  categories: Category[];
}

export interface DreamDiaryCreateRequestDto {
  title: string;
  category: Category;
  dreamScore: number;
  imageUrl?: FormData;
  disclosureScope: DisclosureScopeType;
  content: string;
}
