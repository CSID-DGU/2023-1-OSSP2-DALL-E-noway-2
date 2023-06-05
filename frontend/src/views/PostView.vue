<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div>
    Board Content
    <div class="b-comment">
      <RouterLink to="comment"> Comment </RouterLink>
    </div>
  </div>
</template>

<style>
.b-comment {
  color: white;
}
</style>
