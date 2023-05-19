<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <header class="wrap">
    <div class="container">
      <h1 class="logo">DREAM VISION</h1>
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

.logo {
  @apply text-xl font-bold;
}
</style>
