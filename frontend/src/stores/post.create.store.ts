import type { Post } from '@/types';
import { BoardType } from '@/types/enum/board.type';
import { DisclosureScopeType } from '@/types/enum/disclosure.scope.type';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const usePostCreateStore = defineStore('post-create', () => {
  const post: Ref<Post> = ref({
    title: '',
    image: [],
    disclosureScope: DisclosureScopeType.PRIVATE,
    boardType: BoardType.FREE,
    content: '',
  });

  const setTitle = (title: string) => {
    post.value.title = title;
  };

  const setImage = (image: Blob[]) => {
    post.value.image = image;
  };

  const setDisclosureScope = (scope: DisclosureScopeType) => {
    post.value.disclosureScope = scope;
  };

  const setBoardType = (boardType: BoardType) => {
    post.value.boardType = boardType;
  };

  const setContent = (content: string) => {
    post.value.content = content;
  };

  const getPost = () => {
    return post.value;
  };

  return {
    post,
    setTitle,
    setImage,
    setDisclosureScope,
    setBoardType,
    setContent,
    getPost,
  };
});
