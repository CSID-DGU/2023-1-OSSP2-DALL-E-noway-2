<script setup lang="ts">
import ProfileBar from '@/components/profile/ProfileBar.vue';
</script>

<template>
  <div class="wrap">
    <ProfileBar />
  </div>
</template>

<style scoped>
.wrap {
  @apply w-full flex flex-col justify-center h-full z-[1];
}

.row-group {
  @apply flex flex-row;
}

.row-item {
  @apply m-0.5;
}
/* .row-item:nth-child(1) {
  flex: 2;
}

.row-item:nth-child(2) {
  flex: 3;
}

.row-item:nth-child(3) {
  flex: 3;
} */

.col-group {
  @apply flex flex-col;
}

.col-item {
  @apply m-0.5 text-center text-white;
}
</style>
