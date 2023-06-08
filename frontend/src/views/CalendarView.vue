<script setup lang="ts">
import CalendarPagination from '@/components/calendar/CalendarPagination.vue';
import CalendarWeek from '@/components/calendar/CalendarWeek.vue';
import LoadingAnimation from '@/components/common/LoadingAnimation.vue';
import { useCalendarInfoStore } from '@/stores/calendar.info.store';
import { useMyInfoStore } from '@/stores/my.info.store';
import { getStorage } from '@/utils/local.storage';
import { onMounted, ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import CountDougnutStat from '@/components/calendar/CountDoughnutStat.vue';

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
  fetchTodayDiaryFeed,
  showCalendarList,
  fetchSelectedDiaryFeed,
  showSelectedDiaryFeed,
} = calendarInfo;

onMounted(async () => {
  await apiGetUser();
  if (!getStorage('showDate', 'date')) {
    setSelectedDate(new Date().getDate());
  }
  await fetchCalendarList();
  await fetchTodayDiaryFeed();
});

const clickDate = async (date: number) => {
  if (checkPastToday(date)) {
    setSelectedDate(date);
    await fetchSelectedDiaryFeed(showSelectedDate());
  }
};

const mine = ref(getUser());
const lastDate = ref(showLastDate());
const day = ref(showDay());
const isLoading = ref(showIsLoading());
const calendarList = ref(showCalendarList());
const selectedDiaryFeed = ref(showSelectedDiaryFeed());

watch(showLastDate, (value) => {
  lastDate.value = value;
});
watch(showDay, (value) => {
  day.value = value;
});

watch(showIsLoading, (value) => {
  isLoading.value = value;
});

watch(showCalendarList, (value) => {
  calendarList.value = value;
});

watch(showSelectedDiaryFeed, (value) => {
  selectedDiaryFeed.value = value;
});

const modules = [Pagination];
</script>

<template>
  <main>
    <swiper :pagination="true" :modules="modules" class="mySwiper">
      <swiper-slide>
        <div>
          <CalendarPagination />
          <div class="calendar">
            <CalendarWeek />
            <div v-if="isLoading" class="loading">
              <LoadingAnimation />
            </div>
            <div v-else id="days" class="days">
              <div v-for="i in day" :key="i" class="noday"></div>
              <div
                v-for="day in calendarList.days"
                :key="day.day"
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
          <div v-if="selectedDiaryFeed && selectedDiaryFeed.diaryId !== 0">
            <RouterLink :to="`/dream-diary/${selectedDiaryFeed.diaryId}`">
              <div class="feed-container">
                <h2 class="feed-title">{{ selectedDiaryFeed.title }}</h2>
                <p class="feed-user">{{ selectedDiaryFeed.nickname }}</p>
                <p class="feed-content">
                  {{ selectedDiaryFeed.content }}
                </p>
                <p class="feed-view">👀 {{ selectedDiaryFeed.viewCount }}</p>
                <img :src="selectedDiaryFeed.imageUrl" alt="Post Image" />
              </div>
            </RouterLink>
          </div>
          <div v-else class="feed-container">
            <p class="no-diary-message">이 날에는 일기를 쓰지 않았어요</p>
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <CountDougnutStat />
      </swiper-slide>
    </swiper>
  </main>
</template>

<style scoped>
main {
  padding: 30px 30px 30px;
  background-color: #242424;
  min-height: 100%;
  @apply flex flex-col items-center m-4;
}

.swiper {
  width: 100%;
}

/* .swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  display: flex;
  justify-content: center;
  align-items: center;
} */

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* today diary feed */

.feed-container {
  @apply flex flex-col items-center;
  @apply text-white;
  @apply m-2;
}

.feed-container tag {
  @apply m-2;
}

.feed-container img {
  @apply w-full h-full;
  @apply rounded-2xl;
}
.feed-title {
  @apply text-2xl font-bold;
}
.feed-view {
  @apply flex flex-row;
}

.no-diary-message {
  @apply text-white text-center m-4;
}
</style>
