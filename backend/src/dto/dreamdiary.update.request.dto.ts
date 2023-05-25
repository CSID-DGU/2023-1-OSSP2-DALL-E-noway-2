import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';

export class DreamDiaryUpdateRequestDto {
  title: string;
  category: string;
  dreamScore: number;
  imageUrl?: FormData;
  disclosureScope: DisclosureScopeType;
  content: string;
}
