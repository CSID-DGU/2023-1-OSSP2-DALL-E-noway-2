<script setup lang="ts">
import { postDreamImage } from '@/api/axios.custom';
import BlackBGButton from '@/components/dreamDiary/BlackBGButton.vue';
import WhiteBGButton from '@/components/dreamDiary/WhiteBGButton.vue';
import router from '@/router';
import { useDiaryCreateStore } from '@/stores/diary.create.store';
import { onMounted, ref, type Ref } from 'vue';

const diary = useDiaryCreateStore().getDiary();

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

const requestImage = async () => {
  try {
    console.log(diary.title, diary.content);
    const response = await postDreamImage(diary.title, diary.content);
    contents.value.credits = response.data.credits;
    contents.value.freeGenerateCount = response.data.freeGenerateCount;
    contents.value.maxFreeGenerateCount = response.data.maxFreeGenerateCount;
    contents.value.generatedImages = response.data.generatedImages;
    for (let i = 0; i < 12; i++) {
      contents.value.generatedImages.push(
        'https://avatars.githubusercontent.com/u/31301280?s=200&v=4splash.com/photo-1621574539437-4b5b5b5b5b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjI0NjB8MHwxfHNlYXJjaHwxfHxkcmVhbXN0aW9ufGVufDB8fHx8MTYyMjE0NjY5Mg&ixlib=rb-1.2.1&q=80&w=1080',
      );
    }
    console.log(contents.value);
  } catch (error) {
    console.log(error);
  }
};

const temporarySaveDiary = () => {
  console.log(diary);
};

const convertUrlToBlob = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
};

const registerSelectedImage = async () => {
  // selectedImages의 value에 해당하는 이미지 파일을 diary.image에 넣어준다.
  for (const [key, value] of contents.value.selectedImages) {
    const blob = await convertUrlToBlob(value);
    diary.image.push(blob);
  }
  console.log(diary);

  router.push({ name: 'new-dream-diary' });
};

const selectImage = (imageId: number) => {
  if (contents.value.selectedImages.has(imageId)) {
    contents.value.selectedImages.delete(imageId);
  } else {
    contents.value.selectedImages.set(
      imageId,
      contents.value.generatedImages[imageId],
    );
  }
};

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

.selected-image {
  border: 2px solid red; /* Apply your desired styling for selected images */
}
</style>
