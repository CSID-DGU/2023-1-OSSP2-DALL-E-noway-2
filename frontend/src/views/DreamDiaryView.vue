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
      <RouterLink :to="`/dream-diary/${post.id}/comment`"> Comment </RouterLink>
    </div>
    <RouterView>
      뭐라고 써야 나올까
      <div v-for="post in posts" :key="post.id" class="post">
        {{ post.title }}
      </div>
      <div class="feed-post">
        <div v-for="post in posts" :key="post.id" class="post">
          <h2 class="feed-title">{{ post.title }}</h2>
          <p class="feed-user">{{ post.user }}</p>
          <p class="feed-content">{{ post.content }}</p>
        </div>
      </div>
    </RouterView>
  </main>
</template>

<style scoped></style>
