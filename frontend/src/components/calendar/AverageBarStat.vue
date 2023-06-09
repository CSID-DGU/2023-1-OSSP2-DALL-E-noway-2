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
import type { AverageStat } from '@/types';
import { getAverageStatByMonth } from '@/api/axios.custom';
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
      text: '평균 꿈 점수',
      font: {
        size: 20,
      },
    },
  },
} as ChartOptions;

const { showYear, showMonth } = useCalendarInfoStore();

const averageStat: Ref<AverageStat> = ref({
  myScoreAvg: 0,
  othersScoreAvg: 0,
});
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
  return {
    labels: ['나의 평균 점수', '다른 사람들의 평균 점수'],
    datasets: [
      {
        label: '1~5',
        data: [averageStat.value.myScoreAvg, averageStat.value.othersScoreAvg],
        backgroundColor: [getRandomColor(), getRandomColor()],
        borderWidth: 1,
      },
    ],
  };
});

const fetchAverageStat = async () => {
  try {
    const response = await getAverageStatByMonth(year.value, month.value + 1);
    if (response.status === 200) {
      averageStat.value.myScoreAvg = Number(response.data.myAvgScore);
      averageStat.value.othersScoreAvg = Number(response.data.othersAvgScore);
    } else {
      console.error(response);
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
  await fetchAverageStat();
  console.log(averageStat.value);
});

watch(showYear, (value) => {
  year.value = value;
});

watch(showMonth, (value) => {
  month.value = value;
});

watch([year, month], () => {
  fetchAverageStat();
});
</script>

<template>
  <div>
    <Bar id="my-chart-id" :options="options" :data="data" />
  </div>
</template>

<style scoped></style>
