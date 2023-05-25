<script setup lang="ts">
import { postDreamImage } from '@/api/axios.custom';
import BlackBGButton from '@/components/dreamDiary/BlackBGButton.vue';
import WhiteBGButton from '@/components/dreamDiary/WhiteBGButton.vue';
import router from '@/router';
import { useDiaryCreateStore } from '@/stores/diary.create.store';
import { onMounted, ref } from 'vue';

const diary = useDiaryCreateStore().getDiary();

const contents = ref({
  credits: 0,
  freeGenerateCount: 0,
  maxFreeGenerateCount: 3,
  generatedImages: [],
});

const requestImage = async () => {
  try {
    console.log(diary.title, diary.content);
    const response = await postDreamImage(diary.title, diary.content);
    contents.value.credits = response.data.credits;
    contents.value.freeGenerateCount = response.data.freeGenerateCount;
    contents.value.maxFreeGenerateCount = response.data.maxFreeGenerateCount;
    contents.value.generatedImages = response.data.generatedImages;
    for (let i = 0; i < 12; i++) {
      contents.value.generatedImages.push(contents.value.generatedImages[0]);
    }
    console.log(contents.value);
  } catch (error) {
    console.log(error);
  }
};

const temporarySaveDiary = () => {
  console.log(diary);
};

const registerSelectedImage = () => {};

// onMounted(() => {
//   requestImage();
// });
</script>

<template>
  <div class="wrap">
    <div class="col-group">
      <div class="credtis flex justify-between items-center">
        <div class="flex items-center">
          <span class="mr-2">보유 크레딧</span>
          <span>{{ contents.credits }}</span>
        </div>
      </div>

      <div class="free-generate flex justify-between items-center">
        <div class="flex items-center">
          <span class="mr-2">3회 무료 이미지 생성</span>
          <span
            >{{ contents.freeGenerateCount }}/{{
              contents.maxFreeGenerateCount
            }}</span
          >
        </div>
        <WhiteBGButton :text="'이미지 생성'" @click="requestImage" />
      </div>
      <div class="image-list">
        <ul class="grid grid-cols-2 gap-4">
          <li v-for="(image, i) in contents.generatedImages">
            <img :src="image" />
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
  </div>
</template>

<style scoped>
/* .top-content {
  @apply flex flex-row;
} */
.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1];
}

.col-group {
  @apply flex flex-col justify-center items-center;
}

.credits {
  @apply flex flex-row left-0;
}

.free-generate {
  @apply flex flex-row;
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

.image-list {
  @apply h-full overflow-auto;
}
/*
.credits.row-item {
  @apply m-0.5;
}

.credits.row-item:nth-child(1) {
  flex: 2;
}

.credits.row-item:nth-child(2) {
  flex: 1;
} */
</style>
