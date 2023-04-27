<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <main>
    <h1>Dream Diary</h1>
    <div>
      <RouterLink to="/dream-diary/1/comment">Comment</RouterLink>
    </div>
    <RouterView></RouterView>
  </main>
</template>

<style scoped></style>
