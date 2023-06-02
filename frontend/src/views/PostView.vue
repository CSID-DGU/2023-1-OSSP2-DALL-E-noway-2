<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { ref } from 'vue';
</script>

<template>
  <main>
    <h1>Board</h1>
    <div>
      <RouterLink to="/board/1/comment">Comment</RouterLink>
    </div>
    <RouterView></RouterView>
  </main>
</template>

<style scoped></style>
