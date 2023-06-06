<script setup lang="ts">
import { categoryInfoStore } from '@/stores/category.info.store';
import { useDiaryCreateStore } from '@/stores/diary.create.store';
import { onMounted, ref, watch } from 'vue';

const { getCategories, fetchAllCategories } = categoryInfoStore();
const categories = ref(getCategories());

const { getDiary } = useDiaryCreateStore();
const diary = getDiary();

onMounted(async () => {
  await fetchAllCategories();
});

watch(getCategories, (value) => {
  categories.value = value;
});
</script>

<template>
  <select
    id="category"
    aria-placeholder="카테고리 선택"
    required
    v-model="diary.category"
  >
    <option value="">카테고리 선택</option>
    <option
      v-for="category in categories"
      :key="category.categoryId"
      :value="category.categoryName"
    >
      {{ category.categoryName }}
    </option>
  </select>
</template>

<style scoped>
#category {
  @apply bg-[#E5E5E5] opacity-50 rounded-sm p-2 w-full h-full border border-gray-300;
}
</style>
