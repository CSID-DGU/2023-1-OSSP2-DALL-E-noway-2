import type { BoardType } from './enum/board.type';
import type { DisclosureScopeType } from './enum/disclosure.scope.type';

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Diary {
  title: string;
  category: string;
  dreamScore: number;
  image: Blob[];
  disclosureScope: DisclosureScopeType;
  content: string;
}

export interface Post {
  title: string;
  image: Blob[];
  disclosureScope: DisclosureScopeType;
  boardType: BoardType;
  content: string;
}