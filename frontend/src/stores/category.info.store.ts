import { getAllCategories } from '@/api/axios.custom';
import type { Category } from '@/types';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const categoryInfoStore = defineStore('category-info', () => {
  const categories: Ref<Category[]> = ref([]);

  const setCategories = (newCategories: Category[]) => {
    categories.value = newCategories;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.value.find(
      (category) => category.categoryId === categoryId,
    );
    return category?.categoryName;
  };

  const getCategories = () => {
    return categories.value;
  };

  const fetchAllCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    categories,
    setCategories,
    getCategoryName,
    getCategories,
    fetchAllCategories,
  };
});
