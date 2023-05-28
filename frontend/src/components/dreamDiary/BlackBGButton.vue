<script setup lang="ts">
defineProps(['text']);
</script>

<template>
  <div class="black-button">{{ text }}</div>
</template>

<style scoped>
.black-button {
  @apply py-1.5 px-4 transition-colors font-medium text-white bg-black rounded-lg disabled:opacity-50 m-1;
}
</style>
