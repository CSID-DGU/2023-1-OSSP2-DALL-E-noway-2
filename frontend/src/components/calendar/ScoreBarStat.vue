<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { categoryInfoStore } from '@/stores/category.info.store';
import type { ScoreStat } from '@/types';
import { getScoreStatByMonth } from '@/api/axios.custom';
import { useCalendarInfoStore } from '@/stores/calendar.info.store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '카테고리 별 평균 꿈 점수',
      font: {
        size: 20,
      },
    },
  },
} as ChartOptions;

const { getCategories, fetchAllCategories } = categoryInfoStore();
const { showYear, showMonth } = useCalendarInfoStore();

const categories = ref(getCategories());
const scoreStats: Ref<ScoreStat[]> = ref([]);
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
  if (scoreStats.value.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }
  const labels = scoreStats.value.map((scoreStat) => scoreStat.categoryName);
  const data = scoreStats.value.map((scoreStat) => scoreStat.scoreAvg);

  return {
    labels: labels,
    datasets: [
      {
        label: '1~5',
        data: data,
        backgroundColor: scoreStats.value.map(() => getRandomColor()),
        borderWidth: 1,
      },
    ],
  };
});

const fetchScoreStat = async () => {
  try {
    const response = await getScoreStatByMonth(year.value, month.value + 1);
    if (response.status === 200) {
      scoreStats.value = response.data;
    } else {
      console.error(response);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchAllCategories();
  await fetchScoreStat();
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
  fetchScoreStat();
});
</script>

<template>
  <div>
    <Bar id="my-chart-id" :options="options" :data="data" />
  </div>
</template>

<style scoped></style>
