<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StarRating from '@/components/dreamDiary/StarRating.vue';
import { postDreamDiary, postNewPost } from '@/api/axios.custom';
import type { Category, Post } from '@/types/index';
import CategorySelect from '@/components/dreamDiary/CategorySelect.vue';
import WhiteBGButton from '@/components/dreamDiary/WhiteBGButton.vue';
import BlackBGButton from '@/components/dreamDiary/BlackBGButton.vue';
import DisclosureScopeSelect from '@/components/dreamDiary/DisclosureScopeSelect.vue';
import { useDiaryCreateStore } from '@/stores/diary.create.store';
import { DisclosureScopeType } from '@/types/enum/disclosure.scope.type';
import { usePostCreateStore } from '@/stores/post.create.store';
import { BoardType } from '@/types/enum/board.type';

const router = useRouter();
const post = usePostCreateStore().getPost();

const temporarySavPost = () => {
  console.log(post);
};

const submitPost = async () => {
  console.log(post);
  const formData = new FormData();
  formData.append('title', post.title);
  formData.append('content', post.content);
  formData.append('image', post.image[0]);
  // FIXME: 실제 값으로 변경 필요.
  post.boardType = BoardType.FREE;
  formData.append('disclosureScope', post.disclosureScope);
  const response = await postNewPost(formData as FormData, post.boardType);
  if (response.status === 201) {
    router.push({ name: 'board', params: { postId: response.data } });
  } else {
    console.log(response);
  }
};

const onInputImage = (event: any) => {
  for (let i = 0; i < event.target.files.length; i++) {
    post.image.push(event.target.files[i] as Blob);
  }
};

const fileInput = ref<HTMLElement | null>(null);

const handleUploadClick = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="wrap">
    <form @submit.prevent="submitPost" class="form">
      <div class="form-group">
        <input
          class="title"
          type="text"
          id="title"
          v-model="post.title"
          placeholder="제목을 입력해주세요."
          required
        />
      </div>

      <div class="form-group">
        <div class="row-group">
          <DisclosureScopeSelect
            class="row-item"
            v-model:disclosureScope="post.disclosureScope"
          />

          <div class="row-item">
            <WhiteBGButton
              class="row-item"
              @click="handleUploadClick"
              :text="'이미지 업로드'"
            />
            <input
              multiple
              ref="fileInput"
              type="file"
              style="display: none"
              @change="onInputImage"
            />
          </div>
        </div>
      </div>

      <div class="form-group">
        <textarea
          id="content"
          class="content"
          v-model="post.content"
          placeholder="내용을 입력하세요."
          required
        ></textarea>
      </div>

      <div class="button-group">
        <BlackBGButton @click="temporarySavPost" :text="'임시저장'" />
        <BlackBGButton @click="submitPost" type="submit" :text="'게시'" />
      </div>
    </form>
  </div>
</template>

<style scoped>
input.title,
textarea {
  @apply text-lg block w-full h-96 p-2 border border-gray-300 bg-[#E5E5E5] opacity-50 rounded-sm;
}

input.title {
  @apply w-full h-8;
}

textarea.content {
  @apply w-full;
}

.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1];
}

.form {
  @apply flex flex-col justify-center m-4 h-full;
}

.form-group {
  @apply mb-4 justify-center;
}

#chooseFile {
  visibility: hidden;
}

.button-group {
  @apply flex flex-row bottom-0 right-0 fixed;
}
@media (min-width: 425px) {
  .button-group {
    max-width: 425px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.row-group {
  @apply flex flex-row;
}

.row-item {
  @apply m-0.5;
}
.row-item:nth-child(1) {
  flex: 6;
}

.row-item:nth-child(2) {
  flex: 4;
}
</style>
