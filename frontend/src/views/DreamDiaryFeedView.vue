<script setup lang="ts">
import { onMounted } from 'vue';
import { useMyInfoStore } from '@/stores/my.info.store';

onMounted(async () => {
  await useMyInfoStore().apiGetUser();
});
</script>

<template>
  <main>
    <h1>Home</h1>
  </main>
</template>

<style scoped></style>
