<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { categoryInfoStore } from '@/stores/category.info.store';
import type { CountStat } from '@/types';
import { getCountStatByMonth } from '@/api/axios.custom';
import { useCalendarInfoStore } from '@/stores/calendar.info.store';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '카테고리 별 꿈을 꾼 횟수',
      font: {
        size: 20,
      },
    },
  },
} as ChartOptions;

const { getCategories, fetchAllCategories } = categoryInfoStore();
const { showYear, showMonth } = useCalendarInfoStore();

const categories = ref(getCategories());
const countStats: Ref<CountStat[]> = ref([]);
const year = ref(showYear());
const month = ref(showMonth());

// FIXME: DB에 카테고리마다 색상 정보를 저장하는게 좋아 보입니다.
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.5)`;
};

const data = computed(() => {
  if (countStats.value.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }
  const labels = countStats.value.map((countStat) => countStat.categoryName);
  const data = countStats.value.map((countStat) => Number(countStat.count));

  return {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: countStats.value.map(() => getRandomColor()),
        borderWidth: 1,
      },
    ],
  } as ChartData;
});

const fetchCountStats = async () => {
  try {
    const response = await getCountStatByMonth(year.value, month.value + 1);
    if (response.status === 200) {
      countStats.value = response.data;
    } else {
      console.error(response);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchAllCategories();
  await fetchCountStats();
});

watch(getCategories, (value) => {
  categories.value = value;
});

watch(showYear, (value) => {
  year.value = value;
});

watch(showMonth, (value) => {
  month.value = value;
});

watch([year, month], () => {
  fetchCountStats();
});
</script>

<template>
  <div>
    <Pie id="my-chart-id" :options="options" :data="data" />
  </div>
</template>

<style scoped></style>
