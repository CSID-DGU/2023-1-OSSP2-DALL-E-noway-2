<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import DreamDiaryFeedView from './DreamDiaryFeedView.vue';

const posts = ref([DreamDiaryFeedView]);
</script>

<template>
  <main>
    <h1>Dream Diary</h1>
    <div v-for="post in posts" :key="post.id" class="post">
      <RouterLink :to="`${post.id}/comment`">
        Comment
        {{ post.id }}
        아아아
        <p>
          {{ post.title }}
        </p>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.post {
  width: auto;
  height: 600px;
  color: white;
}
</style>
