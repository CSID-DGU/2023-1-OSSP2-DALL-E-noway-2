<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import StarRating from '@/components/dreamDiary/StarRating.vue';
import { postDreamDiary } from '@/api/axios.custom';
import type { Category } from '@/types/index';
import { DisclosureScopeType } from '@/types/enum/disclosure.scope';

const router = useRouter();

const diary = ref({
  title: '',
  category: '',
  dreamScore: 0,
  image: '',
  disclosureScope: '',
  content: '',
});

const temporarySaveDiary = () => {
  console.log(diary.value);
};

const submitDiary = async () => {
  console.log(diary.value);
  // const formData = new FormData();
  // formData.append('title', diary.value.title);
  // formData.append('category', diary.value.category);
  // formData.append('dreamScore', diary.value.dreamScore.toString());
  // formData.append('image', diary.value.image);
  // formData.append('disclosureScope', diary.value.disclosureScope);
  // formData.append('content', diary.value.content);
  // const response = await postDreamDiary(formData as FormData);
  // if (response.status === 201) {
  //   router.push({ name: 'dream-diary' });
  // } else {
  //   console.log(response);
  // }
};

const onInputImage = (event: any) => {
  diary.value.image = event.target.files[0];
};

const fileInput = ref<HTMLElement | null>(null);

const handleUploadClick = () => {
  fileInput.value?.click();
};

const goToImageCreation = () => {
  // TODO: diary ref 내용을 전역으로 들고 있게 할까?
  router.push({ name: 'generate-image' });
};
</script>

<template>
  <div class="wrap">
    <form @submit.prevent="submitDiary" class="form">
      <div class="form-group">
        <input
          class="title"
          type="text"
          id="title"
          v-model="diary.title"
          placeholder="제목을 입력해주세요."
          required
        />
      </div>
      <div class="form-group">
        <div class="row-group">
          <select
            class="row-item"
            id="category"
            v-model="diary.category"
            aria-placeholder="카테고리 선택"
            required
          >
            <option value="">카테고리 선택</option>
            <option value="음식">음식</option>
            <option value="여행">여행</option>
            <option value="문화">문화</option>
          </select>

          <div class="image-style row-item" @click="goToImageCreation">
            이미지 생성
          </div>
        </div>
      </div>

      <div class="form-group">
        <div class="row-group">
          <select
            class="row-item"
            id="disclosure-scope"
            v-model="diary.disclosureScope"
            required
          >
            <option value="">공개범위 선택</option>
            <option :value="DisclosureScopeType.PRIVATE">나만 보기</option>
            <option :value="DisclosureScopeType.PUBLIC">전체 공개</option>
            <option :value="DisclosureScopeType.LIMITED_PUBLIC">
              팔로워만 보기
            </option>
          </select>

          <div class="row-item">
            <div class="image-style" @click="handleUploadClick">
              이미지 업로드
            </div>
            <input
              ref="fileInput"
              type="file"
              style="display: none"
              @change="onInputImage"
            />
          </div>
        </div>
      </div>

      <StarRating v-model:dreamScore="diary.dreamScore" />

      <div class="form-group">
        <textarea
          id="content"
          class="content"
          v-model="diary.content"
          placeholder="내용을 입력하세요."
          required
        ></textarea>
      </div>

      <div class="button-group">
        <button class="form-bottom" @click="temporarySaveDiary()">
          임시저장
        </button>
        <button class="form-bottom" type="submit">게시</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
input.title,
textarea {
  @apply text-lg block w-full h-96 p-2 border border-gray-300;
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

input.title,
textarea {
  @apply bg-[#E5E5E5] opacity-50 rounded-sm p-2;
}

input.title {
  @apply w-full h-8;
}

textarea.content {
  @apply w-full;
}

select {
  @apply bg-[#E5E5E5] opacity-50 rounded-sm p-2 w-full h-full border border-gray-300;
}

.image-style {
  @apply py-1.5 px-4 transition-colors bg-gray-50 border active:bg-gray-200 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50 w-full text-center;
}

.image-upload {
  @apply py-1.5 px-4 transition-colors bg-gray-50 border active:bg-gray-200 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50 w-full;
}

#chooseFile {
  visibility: hidden;
}

button.form-bottom {
  @apply py-1.5 px-4 transition-colors font-medium text-white bg-black rounded-lg disabled:opacity-50 m-1;
}

.button-group {
  @apply flex flex-row-reverse;
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
