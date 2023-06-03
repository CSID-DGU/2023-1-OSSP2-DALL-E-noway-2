<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import HeaderBar from './components/common/HeaderBar.vue';
import NavBar from './components/common/NavBar.vue';

const route = useRoute();

const checkValidRoute = (visibleRoutes: string[]) => {
  return visibleRoutes.includes(route.name as string);
};

const setScreenSize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

onMounted(() => {
  setScreenSize();
});
</script>

<template>
  <HeaderBar />
  <div class="relative">
    <img
      class="moon"
      src="@/assets/images/moon.svg"
      alt="달 이미지"
      onerror="this.style.display='none'"
    />
    <RouterView />
    <NavBar
      v-if="
        checkValidRoute([
          'dream-diary-feed',
          'dream-diary',
          'board-list',
          'board',
          'post',
          'profile',
          'calendar',
          'bookmark',
          'like',
          'comment',
        ])
      "
    />
  </div>
  <img
    class="cloud"
    src="@/assets/images/cloud.svg"
    alt="구름 이미지"
    onerror="this.style.display='none'"
  />
</template>

<style scoped>
.moon {
  @apply absolute inset-x-5 object-cover z-0;
}

.cloud {
  @apply absolute inset-x-0 bottom-0 w-full h-auto z-0;
}
</style>
