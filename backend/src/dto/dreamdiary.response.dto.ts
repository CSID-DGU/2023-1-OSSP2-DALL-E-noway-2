import { DisclosureScopeType } from 'src/enum/disclosure.scope.type';
import { UserDto } from './user.dto';

export class DreamDiaryResponseDto {
  diaryId: number;
  title: string;
  content: string;
  category: string;
  dreamScore: number;
  viewCount: number;
  user: UserDto;
  createdAt: Date;
  diaryImageUrl: string;
  disclosureScope: DisclosureScopeType;
}
