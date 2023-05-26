<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StarRating from '@/components/dreamDiary/StarRating.vue';
import { postDreamDiary } from '@/api/axios.custom';
import type { Category } from '@/types/index';
import { DisclosureScopeType } from '@/types/enum/disclosure.scope';
import CategorySelect from '@/components/dreamDiary/CategorySelect.vue';
import WhiteBGButton from '@/components/dreamDiary/WhiteBGButton.vue';
import BlackBGButton from '@/components/dreamDiary/BlackBGButton.vue';
import DisclosureScopeSelect from '@/components/dreamDiary/DisclosureScopeSelect.vue';
import { useDiaryCreateStore } from '@/stores/diary.create.store';
import router from '@/router';

// const router = useRouter();

const diary = useDiaryCreateStore().getDiary();

// const diary = ref({
//   title: '',
//   category: '',
//   dreamScore: 0,
//   image: '',
//   disclosureScope: '',
//   content: '',
// });

const temporarySaveDiary = () => {
  console.log(diary);
};

const submitDiary = async () => {
  console.log(diary);
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
  for (let i = 0; i < event.target.files.length; i++) {
    diary.image.push(event.target.files[i] as Blob);
  }
};

const fileInput = ref<HTMLElement | null>(null);

const handleUploadClick = () => {
  fileInput.value?.click();
};

const goToImageCreation = () => {
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
          <CategorySelect class="row-item" v-model:category="diary.category" />
          <WhiteBGButton
            class="row-item"
            @click="goToImageCreation"
            :text="'이미지 생성'"
          />
        </div>
      </div>

      <div class="form-group">
        <div class="row-group">
          <DisclosureScopeSelect
            class="row-item"
            v-model:disclosureScope="diary.disclosureScope"
          />

          <div class="row-item">
            <WhiteBGButton
              class="row-item"
              @click="handleUploadClick"
              :text="'이미지 업로드'"
            />
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
        <BlackBGButton @click="temporarySaveDiary" :text="'임시저장'" />
        <BlackBGButton @click="submitDiary" type="submit" :text="'게시'" />
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
