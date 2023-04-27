<script setup lang="ts">
import { ref } from 'vue';
</script>

<template>
  <div class="wrap">
    <nav>
      <RouterLink to="/"> HOME </RouterLink>
      <RouterLink to="/board-list"> BOARD </RouterLink>
      <RouterLink to="/calendar"> CALENDAR </RouterLink>
      <RouterLink to="/profile"> PROFILE </RouterLink>
    </nav>
  </div>
</template>

<style scoped></style>
