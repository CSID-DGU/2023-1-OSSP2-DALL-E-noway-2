import { DisclosureScopeType } from '@/types/enum/disclosure.scope';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

interface Diary {
  title: string;
  category: string;
  dreamScore: number;
  image: Blob[];
  disclosureScope: DisclosureScopeType;
  content: string;
}

export const useDiaryCreateStore = defineStore('diary-create', () => {
  const diary: Ref<Diary> = ref({
    title: '',
    category: '',
    dreamScore: 0,
    image: [],
    disclosureScope: DisclosureScopeType.PRIVATE,
    content: '',
  });

  const setTitle = (title: string) => {
    diary.value.title = title;
  };

  const setCategory = (category: string) => {
    diary.value.category = category;
  };

  const setDreamScore = (score: number) => {
    diary.value.dreamScore = score;
  };

  const setImage = (image: Blob[]) => {
    diary.value.image = image;
  };

  const setDisclosureScope = (scope: DisclosureScopeType) => {
    diary.value.disclosureScope = scope;
  };

  const setContent = (content: string) => {
    diary.value.content = content;
  };

  const getDiary = () => {
    return diary.value;
  };

  return {
    diary,
    setTitle,
    setCategory,
    setDreamScore,
    setImage,
    setDisclosureScope,
    setContent,
    getDiary,
  };
});
