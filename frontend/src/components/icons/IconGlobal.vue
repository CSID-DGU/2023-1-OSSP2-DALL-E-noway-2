<script setup lang="ts">
const props = defineProps<{
  opacity: number;
}>();
</script>

<template>
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.9997 36.6673C29.2044 36.6673 36.6663 29.2054 36.6663 20.0007C36.6663 10.7959 29.2044 3.33398 19.9997 3.33398C10.7949 3.33398 3.33301 10.7959 3.33301 20.0007C3.33301 29.2054 10.7949 36.6673 19.9997 36.6673Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M13.3333 5H15C11.75 14.7333 11.75 25.2667 15 35H13.3333"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M25 5C28.25 14.7333 28.25 25.2667 25 35"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M5 26.6667V25C14.7333 28.25 25.2667 28.25 35 25V26.6667"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M5 15C14.7333 11.75 25.2667 11.75 35 15"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
  </svg>
</template>
