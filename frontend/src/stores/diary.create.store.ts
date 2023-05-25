import type { DisclosureScopeType } from '@/types/enum/disclosure.scope';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDiaryCreateStore = defineStore('diary-create', () => {
  const diary = ref({
    title: '',
    category: '',
    dreamScore: 0,
    image: '',
    disclosureScope: '',
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

  const setImage = (image: string) => {
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
