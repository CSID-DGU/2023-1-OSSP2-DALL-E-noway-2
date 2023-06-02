<script setup lang="ts">
defineProps(['text']);
</script>

<template>
  <div class="white-button">{{ text }}</div>
</template>

<style scoped>
.white-button {
  @apply py-1.5 px-4 transition-colors bg-gray-50 border active:bg-gray-200 font-medium border-gray-200 text-gray-900 rounded-lg hover:bg-gray-100 disabled:opacity-50 w-full text-center;
}
</style>
