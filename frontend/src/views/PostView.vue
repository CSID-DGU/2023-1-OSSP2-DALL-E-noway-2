<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
</script>

<template>
  <div>
    Board Content
    <div class="b-comment">
      <RouterLink to="comment"> Comment </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import BoardListView from './BoardListView.vue';
import { RouterLink } from 'vue-router';
</script>

<style>
.b-comment {
  color: white;
}
</style>
