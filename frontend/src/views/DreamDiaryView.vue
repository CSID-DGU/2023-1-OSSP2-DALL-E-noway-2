<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
import { defineProps } from 'vue';
import DreamDiaryFeedView from './DreamDiaryFeedView.vue';

export default {
  components: {
    RouterLink,
    RouterView,
  },
  setup() {
    const posts = ref([DreamDiaryFeedView]);
    return {
      posts,
    };
  },
};
</script>

<template>
  <main>
    <h1>Dream Diary</h1>
    <div v-for="post in posts" :key="post.id" class="post">
      <RouterLink to="comment">
        Comment
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
