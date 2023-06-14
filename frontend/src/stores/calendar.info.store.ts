import { getMonthDiaryList, getDreamDiaryFeedByDate } from '@/api/axios.custom';
import type { CalendarDayInfo, CalendarList, DiaryFeed } from '@/types';
import { getStorage, saveStorage } from '@/utils/local.storage';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useCalendarInfoStore = defineStore('calendar-info', () => {
  // 오늘 날짜
  const today = ref(new Date());

  const getStorageYear = () => {
    if (getStorage('showDate', 'year')) {
      return getStorage('showDate', 'year');
    }
    return today.value.getFullYear();
  };

  // 2023 현재 보이는 년도
  const year = ref(getStorageYear());

  const getStorageMonth = () => {
    if (getStorage('showDate', 'month')) {
      return getStorage('showDate', 'month');
    }
    return today.value.getMonth();
  };

  // 0 ~ 11 현재 보이는 달
  const month = ref(getStorageMonth());
  // 현재 월 1일의 요일
  const day = ref(new Date(year.value, month.value).getDay());
  // 현재 월의 총 일수
  const lastDate = ref(new Date(year.value, month.value + 1, 0).getDate());

  const getStorageDate = (): number => {
    if (getStorage('showDate', 'date')) {
      return getStorage('showDate', 'date');
    }
    return today.value.getDate();
  };
  // 선택한 일
  const selectDate = ref(getStorageDate());

  // 로딩 여부
  const isLoading = ref(false);

  const showIsLoading = () => {
    return isLoading.value;
  };

  // 2023. 2 캘린더 타이틀
  const dateTitle = ref(`${year.value}. ${month.value + 1}`);

  const showToday = () => {
    return today.value;
  };
  const showYear = () => {
    return year.value;
  };
  const showMonth = () => {
    return month.value;
  };
  const showDay = () => {
    return day.value;
  };
  const showLastDate = () => {
    return lastDate.value;
  };

  const showSelectedDate = () => {
    return selectDate.value;
  };

  // 선택한 일이 변경되면, 로컬스토리지에 저장
  const setSelectedDate = (date: number) => {
    selectDate.value = date;
    saveStorageSelectedDate();
  };

  const showDateTitle = () => {
    return dateTitle.value;
  };
  const setDateTitle = () => {
    dateTitle.value = `${showYear()}. ${showMonth() + 1}`;
  };

  // localStorage에 선택한 날 저장
  const saveStorageSelectedDate = () => {
    const showDate = {
      year: showYear(),
      month: showMonth(),
      date: showSelectedDate(),
    };
    saveStorage('showDate', showDate);
  };

  // 해당 월 1일의 요일 계산하기
  const calcFirstDay = () => {
    day.value = new Date(year.value, month.value).getDay();
  };

  // 월 마지막 날짜(총 일수) 계산하기
  const calcLastDate = () => {
    lastDate.value = new Date(year.value, month.value + 1, 0).getDate();
  };

  // 데이터 시작 기준일
  const FIRST_DAY = {
    year: 2022,
    month: 5,
    day: 1,
  };

  // 달력에 보여줄 날짜 계산하기
  const calcOptions = () => {
    const options = [];
    for (let year = FIRST_DAY.year; year <= showToday().getFullYear(); year++) {
      if (year == FIRST_DAY.year) {
        for (let month = FIRST_DAY.month - 1; month < 12; month++) {
          options.push(`${year}. ${month + 1}`);
        }
        continue;
      } else {
        for (let month = 0; month <= showToday().getMonth(); month++) {
          options.push(`${year}. ${month + 1}`);
        }
      }
    }
    return options;
  };

  // 달력에 보여줄 월 리스트 (2023. 6 ~ 현재 연도. 월)
  const monthList = ref(calcOptions());

  const showMonthList = () => {
    return monthList.value;
  };

  const calendarList: Ref<CalendarList> = ref({
    year: 0,
    month: 0,
    days: Array.from({ length: 31 }, (_, i) => {
      return {
        day: i + 1,
        diaryId: null,
        dreamScore: 0,
      } as CalendarDayInfo;
    }),
  } as CalendarList);

  const showCalendarList = () => {
    return calendarList.value;
  };

  const setCalendarList = (data: CalendarList) => {
    calendarList.value = data;
  };

  // 월 일기 작성 현황 API 호출
  const fetchCalendarList = async () => {
    isLoading.value = true;
    try {
      const response = await getMonthDiaryList(year.value, month.value + 1);
      const data = response.data as CalendarList;
      setCalendarList(data);
      isLoading.value = false;
    } catch (error) {
      console.log(error);
      isLoading.value = false;
    }
  };

  // 내용을 제한된 길이로 자르고 생략 부호를 추가하는 함수
  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) {
      return content;
    } else {
      return content.slice(0, maxLength) + '...';
    }
  };

  const selectedDiaryFeed: Ref<DiaryFeed> = ref({
    diaryId: 0,
    imageUrl: '',
    title: '',
    content: '',
    nickname: '',
    viewCount: 0,
  } as DiaryFeed);

  const showSelectedDiaryFeed = () => {
    return selectedDiaryFeed.value;
  };

  // 선택한 날짜 일기 피드 정보 API 호출
  const fetchSelectedDiaryFeed = async (day: number) => {
    try {
      const response = await getDreamDiaryFeedByDate(
        year.value,
        month.value,
        day,
      );
      if (response.status === 200 && response.data !== '') {
        const data = response.data as DiaryFeed;
        selectedDiaryFeed.value = data;
        selectedDiaryFeed.value.content = truncateContent(data.content, 25);
      } else {
        selectedDiaryFeed.value = {
          diaryId: 0,
          imageUrl: '',
          title: '',
          content: '',
          nickname: '',
          viewCount: 0,
        } as DiaryFeed;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 오늘 날짜 일기 피드 정보 API 호출
  const fetchTodayDiaryFeed = async () => {
    await fetchSelectedDiaryFeed(getStorageDate());
  };

  // 이전 달 버튼 클릭
  const prevMonth = () => {
    if (year.value === 2022 && month.value <= 7) return;
    month.value--;
    if (month.value < 0) {
      month.value = 11;
      year.value--;
    }
    setSelectedDate(1);
    calcFirstDay();
    calcLastDate();
    setDateTitle();
    // apiLogsMonthData();
  };

  // 다음 달 버튼 클릭
  const nextMonth = () => {
    if (
      today.value.getFullYear() === year.value &&
      today.value.getMonth() === month.value
    )
      return;
    month.value++;
    if (month.value > 11) {
      month.value = 0;
      year.value++;
    }
    setSelectedDate(1);
    calcFirstDay();
    calcLastDate();
    setDateTitle();
    // apiLogsMonthData();
  };

  // 일별 누적시간 색상 컬러셋
  const DATE_BG_COLOR = {
    0: '#292929', // no diary
    1: '#9a9aff', // 1점
    2: '#917bff', // 2점
    3: '#7b61ff', // 3점
    4: '#684aff', // 4점
    5: '#5a39ff', // 5점
  };

  // 일기 점수 별 색상 계산
  const getDateBgColor = (dreamScore: number) => {
    if (dreamScore === 0) return DATE_BG_COLOR[0];
    if (dreamScore === 1) return DATE_BG_COLOR[1];
    if (dreamScore === 2) return DATE_BG_COLOR[2];
    if (dreamScore === 3) return DATE_BG_COLOR[3];
    if (dreamScore === 4) return DATE_BG_COLOR[4];
    return DATE_BG_COLOR[5];
  };

  // 오늘인지 체크
  const checkToday = (date: number) => {
    if (date !== today.value.getDate()) return false;
    if (showYear() !== today.value.getFullYear()) return false;
    if (showMonth() !== today.value.getMonth()) return false;
    return true;
  };

  // 오늘보다 과거인지 체크
  const checkPastToday = (date: number) => {
    if (showYear() < today.value.getFullYear()) return true; // 지난 년도
    if (showMonth() < today.value.getMonth()) return true;
    if (date <= today.value.getDate()) return true;
    return false;
  };

  // 캘린더 날짜 색상
  const getDateColor = (date: number) => {
    if (checkPastToday(date)) return 'var(--color-black)';
  };

  // 캘린더 제목으로 월 선택 시
  const selectMonth = () => {
    const dateArr = showDateTitle().split('. ');
    if (
      year.value !== Number(dateArr[0]) ||
      month.value !== Number(dateArr[1]) - 1
    ) {
      year.value = Number(dateArr[0]);
      month.value = Number(dateArr[1]) - 1;
      setSelectedDate(1);
      calcFirstDay();
      calcLastDate();
      // apiLogsMonthData();
    }
  };

  return {
    year,
    month,
    day,
    lastDate,
    monthList,
    showMonthList,
    prevMonth,
    nextMonth,
    getDateBgColor,
    getDateColor,
    checkToday,
    checkPastToday,
    selectMonth,
    showDateTitle,
    calcOptions,
    showIsLoading,
    setSelectedDate,
    showLastDate,
    showDay,
    showSelectedDate,
    fetchCalendarList,
    showCalendarList,
    fetchTodayDiaryFeed,
    fetchSelectedDiaryFeed,
    showSelectedDiaryFeed,
    showYear,
    showMonth,
  };
});
