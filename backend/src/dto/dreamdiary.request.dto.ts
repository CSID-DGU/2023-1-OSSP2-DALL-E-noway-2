import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';

export class DreamDiaryRequestDto {
  title: string;
  category: string;
  dreamScore: number;
  image?: FormData;
  disclosureScope: DisclosureScopeType;
  content: string;
}
