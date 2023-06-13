import type { Diary } from '@/types';
import { DisclosureScopeType } from '@/types/enum/disclosure.scope.type';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useDiaryCreateStore = defineStore('diary-create', () => {
  const diary: Ref<Diary> = ref({
    title: '',
    category: '',
    dreamScore: 0,
    image: [],
    disclosureScope: DisclosureScopeType.PUBLIC,
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

  const setImage = (image: string[]) => {
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

  const getDreamScore = () => {
    return diary.value.dreamScore;
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
    getDreamScore,
  };
});
