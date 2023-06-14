<script setup lang="ts">
import { getCreditInfo, postDreamImage } from '@/api/axios.custom';
import BlackBGButton from '@/components/dreamDiary/BlackBGButton.vue';
import WhiteBGButton from '@/components/dreamDiary/WhiteBGButton.vue';
import { useRouter } from 'vue-router';
import { useDiaryCreateStore } from '@/stores/diary.create.store';
import { onMounted, ref, type Ref } from 'vue';
import IconCoin from '@/components/icons/IconCoin.vue';
import LoadingAnimation from '@/components/common/LoadingAnimation.vue';
import type { Diary } from '@/types';

const router = useRouter();

const { getDiary } = useDiaryCreateStore();
const diary: Ref<Diary> = ref(getDiary());

interface Contents {
  credits: number;
  freeGenerateCount: number;
  maxFreeGenerateCount: number;
  generatedImages: string[];
  selectedImages: Map<number, string>;
}

const contents: Ref<Contents> = ref({
  credits: 0,
  freeGenerateCount: 0,
  maxFreeGenerateCount: 3,
  generatedImages: [],
  selectedImages: new Map<number, string>(),
});

const requestCount = ref(1);
const isLoading = ref(false);

onMounted(async () => {
  try {
    const response = await getCreditInfo();
    const creditInfo = response.data.creditInfo;
    contents.value.credits = creditInfo.credits;
    contents.value.freeGenerateCount = creditInfo.freeGenerateCount;
    contents.value.maxFreeGenerateCount = creditInfo.maxFreeGenerateCount;
  } catch (error) {
    console.log(error);
  }
});

const requestImage = async () => {
  try {
    isLoading.value = true;
    const response = await postDreamImage(
      diary.value.title,
      diary.value.content,
      requestCount.value,
    );
    contents.value.credits = response.data.credits;
    contents.value.freeGenerateCount = response.data.freeGenerateCount;
    contents.value.maxFreeGenerateCount = response.data.maxFreeGenerateCount;
    for (const image of response.data.generatedImages) {
      contents.value.generatedImages.push(image);
    }
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    isLoading.value = false;
  }
};

const temporarySaveDiary = () => {
  console.log(diary);
};

const registerSelectedImage = async () => {
  // selectedImages의 value에 해당하는 이미지 파일을 diary.image에 넣어준다.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, value] of contents.value.selectedImages) {
    diary.value.image.push(value);
  }
  router.push({ name: 'new-dream-diary' });
};

const selectImage = (imageId: number) => {
  contents.value.selectedImages.clear();
  contents.value.selectedImages.set(
    imageId,
    contents.value.generatedImages[imageId],
  );
};
</script>

<template>
  <div class="wrap">
    <div class="credit-info">
      <div class="credit-label">
        <h1>보유 크레딧</h1>
      </div>
      <div class="credit-count">
        <IconCoin />
        <h1>{{ contents.credits }}</h1>
      </div>
    </div>

    <div class="generate-info">
      <div class="generate-description">
        <h1>3회 무료 이미지 생성</h1>
      </div>
      <div class="generate-able-count">
        <h1>
          {{ contents.freeGenerateCount }} / {{ contents.maxFreeGenerateCount }}
        </h1>
      </div>
    </div>

    <div class="generate-info-2">
      <div class="generate-count">
        <input type="number" v-model="requestCount" min="1" max="12" />
      </div>
      <div class="generate-button">
        <WhiteBGButton :text="'이미지 생성'" @click="requestImage" />
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <LoadingAnimation />
    </div>
    <div v-else class="image-list">
      <ul class="grid grid-cols-2 gap-4">
        <li v-for="(image, i) in contents.generatedImages" v-bind:key="i">
          <img
            :src="image"
            :key="i"
            :class="{
              'selected-image': contents.selectedImages.has(i),
            }"
            @click="selectImage(i)"
          />
        </li>
      </ul>
    </div>

    <div class="button-group">
      <BlackBGButton @click="temporarySaveDiary" :text="'임시저장'" />
      <BlackBGButton
        @click="registerSelectedImage"
        type="submit"
        :text="'등록'"
      />
    </div>
  </div>
</template>

<style scoped>
.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1];
  @apply text-white;
  @apply items-center;
}

.credit-info {
  @apply flex flex-row items-center justify-center;
  @apply w-full;
  @apply m-2;
}

.credit-label {
  @apply flex flex-row items-center justify-center;
}

.credit-count {
  @apply flex flex-row items-center justify-center;
}

.generate-info {
  @apply m-2;
  @apply flex flex-row items-center justify-center;
  @apply w-full;
}

.generate-info-2 {
  @apply m-2;
  @apply flex flex-row items-center justify-center;
  @apply w-full;
}

.generate-description {
  @apply m-2;
  @apply flex flex-row items-center justify-center;
}

.generate-able-count {
  @apply m-2;
  @apply flex flex-row items-center justify-center;
}

.generate-count {
  @apply m-2;
  @apply flex flex-row items-center justify-center;
}

.generate-count input {
  @apply w-12;
  @apply text-black;
  @apply text-center;
  @apply border-2 border-white;
  @apply rounded-md;
}

.generate-button {
  @apply m-2;
  @apply flex flex-row items-center justify-center;
}

.image-list {
  height: 32rem;
  overflow: auto;
  @apply m-4;
}

.image-card {
  @apply flex flex-row items-center justify-center;
  @apply w-full;
  @apply m-2;
}

.selected-image {
  border: 2px solid red; /* Apply your desired styling for selected images */
}

.button-group {
  @apply fixed bottom-0 left-0 right-0;
  @apply flex flex-row items-center;
  @apply p-4;
}
.button-group {
  position: fixed;
  bottom: 50px;
  left: 0;
  width: 100%;
  height: 60px;
  filter: var(--menu-shadow);
  z-index: 9;
  user-select: none;
  @apply flex flex-row items-center;
  @apply p-4;
}

@media (min-width: 425px) {
  .button-group {
    max-width: 425px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.loading {
  height: 190px;
}
</style>
