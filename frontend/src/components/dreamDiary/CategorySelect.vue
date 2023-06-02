<script setup lang="ts">
defineProps(['category']);
defineEmits(['update:category']);
</script>

<template>
  <select
    id="category"
    aria-placeholder="카테고리 선택"
    :value="category"
    @input="$emit('update:category', $event.target.value)"
    required
  >
    <option value="">카테고리 선택</option>
    <option value="음식">음식</option>
    <option value="여행">여행</option>
    <option value="문화">문화</option>
  </select>
</template>

<style scoped>
#category {
  @apply bg-[#E5E5E5] opacity-50 rounded-sm p-2 w-full h-full border border-gray-300;
}
</style>
