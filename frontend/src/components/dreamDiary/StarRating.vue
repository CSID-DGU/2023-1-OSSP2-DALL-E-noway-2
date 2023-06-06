<script setup lang="ts">
import { useDiaryCreateStore } from '@/stores/diary.create.store';
import { onMounted, ref, watch } from 'vue';

const { getDiary, getDreamScore } = useDiaryCreateStore();
const diary = getDiary();

const dreamScore = ref(getDreamScore());

watch(getDreamScore, (value) => {
  dreamScore.value = value;
});

onMounted(() => {
  dreamScore.value = diary.dreamScore;
});
</script>

<template>
  <div class="star-dreamScore space-x-4 mx-auto">
    <input
      type="radio"
      id="5-stars"
      name="dreamScore"
      :value="5"
      v-model="diary.dreamScore"
      @input="dreamScore = $event.target.value"
      :checked="dreamScore === 5"
    />
    <label for="5-stars" class="star pr-4">★</label>
    <input
      type="radio"
      id="4-stars"
      name="dreamScore"
      :value="4"
      v-model="diary.dreamScore"
      @input="dreamScore = $event.target.value"
      :checked="dreamScore === 4"
    />
    <label for="4-stars" class="star">★</label>
    <input
      type="radio"
      id="3-stars"
      name="dreamScore"
      :value="3"
      v-model="diary.dreamScore"
      @input="dreamScore = $event.target.value"
      :checked="dreamScore === 3"
    />
    <label for="3-stars" class="star">★</label>
    <input
      type="radio"
      id="2-stars"
      name="dreamScore"
      :value="2"
      v-model="diary.dreamScore"
      @input="dreamScore = $event.target.value"
      :checked="dreamScore === 2"
    />
    <label for="2-stars" class="star">★</label>
    <input
      type="radio"
      id="1-star"
      name="dreamScore"
      :value="1"
      v-model="diary.dreamScore"
      @input="dreamScore = $event.target.value"
      :checked="dreamScore === 1"
    />
    <label for="1-star" class="star">★</label>
  </div>
</template>

<style scoped>
.star-dreamScore {
  display: flex;
  flex-direction: row-reverse;
  font-size: 2.25rem;
  line-height: 2.5rem;
  padding: 0 0.2em;
  text-align: center;
  width: 5em;
}

.star-dreamScore input {
  display: none;
}

.star-dreamScore label {
  -webkit-text-fill-color: transparent; /* Will override color (regardless of order) */
  -webkit-text-stroke-width: 2.3px;
  -webkit-text-stroke-color: #2b2a29;
  cursor: pointer;
}

.star-dreamScore :checked ~ label {
  -webkit-text-fill-color: gold;
}

.star-dreamScore label:hover,
.star-dreamScore label:hover ~ label {
  -webkit-text-fill-color: #fff58c;
}
</style>
