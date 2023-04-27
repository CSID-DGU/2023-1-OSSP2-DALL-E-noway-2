<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { onMounted } from 'vue';
import HeaderBar from './components/common/HeaderBar.vue';
import NavBar from './components/common/NavBar.vue';

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
  <RouterView />
  <NavBar />
</template>

<style scoped></style>
