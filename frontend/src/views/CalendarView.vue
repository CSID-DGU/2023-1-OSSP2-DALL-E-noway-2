<script setup lang="ts">
import CalendarPagination from '@/components/calendar/CalendarPagination.vue';
import CalendarWeek from '@/components/calendar/CalendarWeek.vue';
import LoadingAnimation from '@/components/common/LoadingAnimation.vue';
import { useCalendarInfoStore } from '@/stores/calendar.info.store';
import { useMyInfoStore } from '@/stores/my.info.store';
import { getStorage } from '@/utils/local.storage';
import { onMounted, ref, watch, type Ref } from 'vue';

const { getUser, apiGetUser } = useMyInfoStore();
const calendarInfo = useCalendarInfoStore();
const {
  showIsLoading,
  selectMonth,
  setSelectedDate,
  checkPastToday,
  showLastDate,
  showDay,
  getDateBgColor,
  checkToday,
  showSelectedDate,
  getDateColor,
  fetchCalendarList,
  selectDate,
} = calendarInfo;

onMounted(async () => {
  await apiGetUser();
  await fetchCalendarList();
  console.log(calendarInfo.calendarList);
  if (!getStorage('showDate', 'date')) {
    setSelectedDate(new Date().getDate());
  }
});

const clickDate = (date: number) => {
  if (checkPastToday(date)) setSelectedDate(date);
  console.log(calendarInfo.selectDate);
  // console.log(showSelectedDate());
  // console.log(6 === showSelectedDate());
};

const mine = ref(getUser());
const lastDate = ref(showLastDate());
const day = ref(showDay());
const isLoading = ref(showIsLoading());

watch(showLastDate, (value) => {
  lastDate.value = value;
});
watch(showDay, (value) => {
  day.value = value;
});

watch(showIsLoading, (value) => {
  isLoading.value = value;
});
</script>

<template>
  <main>
    <CalendarPagination />
    <div class="calendar">
      <CalendarWeek />
      <div v-if="isLoading" class="loading">
        <LoadingAnimation />
      </div>
      <div v-else id="days" class="days">
        <div v-for="i in day" :key="i" class="noday"></div>
        <div
          v-for="day in calendarInfo.calendarList.days"
          :key="day"
          @click="clickDate(day.day)"
          class="day"
          :style="{
            background: getDateBgColor(day.dreamScore),
            color: 'white',
          }"
          :class="{
            today: checkToday(day.day),
            selected: day.day === showSelectedDate(),
          }"
        >
          {{ day.day }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 30px 30px 30px;
  background-color: #242424;
  min-height: 100%;
  @apply flex flex-col items-center m-4;
}

.loading {
  height: 190px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 10px;
  width: 100%;
  height: 100%;
  user-select: none;
}

.days .day {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  margin: 0 auto;
  transition: border-radius 0.2s ease-in-out;
}
.today {
  color: white;
  border: 1px solid var(--cal-today);
  background-color: white;
}

.days > .day.selected {
  font-weight: 700;
  border-radius: 50%;
  border: none;
  background-color: #5a39ff !important;
  transition: background-color 0.3s ease; /* 부드러운 전환 효과를 위한 transition 속성 추가 */
}
</style>
