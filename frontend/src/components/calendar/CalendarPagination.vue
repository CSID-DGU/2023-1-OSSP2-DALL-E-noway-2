<script setup lang="ts">
import { ref, watch } from 'vue';
import VIcon from '@/components/icons/IConChevron.vue';
import { useCalendarInfoStore } from '@/stores/calendar.info.store';

const calendarInfo = useCalendarInfoStore();
const {
  prevMonth,
  nextMonth,
  showDateTitle,
  calcOptions,
  showIsLoading,
  selectMonth,
} = calendarInfo;

const isLoading = ref(showIsLoading());
watch(showIsLoading, (value) => {
  isLoading.value = value;
});

const clickPrevMonth = () => {
  if (!isLoading.value) prevMonth();
};
const clickNextMonth = () => {
  if (!isLoading.value) nextMonth();
};
</script>

<template>
  <div class="calendar-pagination">
    <button @click="clickPrevMonth">
      <VIcon :color="`white`" />
    </button>
    <select
      class="title select"
      @change="selectMonth"
      v-model="calendarInfo.dateTitle"
      name="year-month"
    >
      <option
        :disabled="isLoading"
        v-for="(date, i) in calcOptions()"
        :key="i"
        :value="date"
        :selected="showDateTitle() === date"
      >
        {{ date }}
      </option>
    </select>
    <button @click="clickNextMonth">
      <VIcon :color="`white`" />
    </button>
  </div>
</template>

<style scoped>
.calendar-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.calendar-pagination button {
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.calendar-pagination button:first-child {
  transform: rotate(180deg);
}
.calendar-pagination .title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  user-select: none;
  cursor: pointer;
  text-align: center;
  font-family: var(--font-family);
}

.select {
  cursor: pointer;
  -o-appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  border: none;
}
</style>
