<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import IconGoBackVue from '../icons/IconGoBack.vue';

const route = useRoute();
const router = useRouter();

const checkValidRoute = (visibleRoutes: string[]) => {
  return visibleRoutes.includes(route.name as string);
};

// 현재 route가 뒤로가기 버튼을 활성화할 routes 리스트
const validRoutes = [
  'dream-diary',
  'new-dream-diary',
  'generate-image',
  'board',
  'post',
  'new-board',
  'comment',
  'profile',
  'profile-edit',
  'follow',
  'bookmark',
  'like',
];

const goBack = () => {
  router.back();
};
</script>

<template>
  <header class="wrap">
    <div class="container">
      <div class="button">
        <button v-if="checkValidRoute(validRoutes)" @click="goBack">
          <IconGoBackVue />
        </button>
      </div>
      <div class="logo">
        <h1>DREAM VISION</h1>
      </div>
    </div>
  </header>
</template>

<style scoped>
.wrap {
  @apply bg-black text-white py-4;
}

.container {
  @apply mx-auto flex items-center justify-center px-4;
}

.button {
  @apply left-2 absolute;
}

.logo {
  @apply text-xl font-bold justify-center text-center;
}
</style>
