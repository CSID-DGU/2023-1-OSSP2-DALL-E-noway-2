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
    <rect width="40" height="40" fill="black" fill-opacity="0.2" />
    <path
      d="M20.1999 21.2995C20.0832 21.2828 19.9332 21.2828 19.7999 21.2995C16.8665 21.1995 14.5332 18.7995 14.5332 15.8495C14.5332 12.8328 16.9665 10.3828 19.9999 10.3828C23.0165 10.3828 25.4665 12.8328 25.4665 15.8495C25.4499 18.7995 23.1332 21.1995 20.1999 21.2995Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M31.2333 32.2996C28.2666 35.0163 24.3333 36.6663 19.9999 36.6663C15.6666 36.6663 11.7333 35.0163 8.7666 32.2996C8.93327 30.7329 9.93327 29.1996 11.7166 27.9996C16.2833 24.9663 23.7499 24.9663 28.2833 27.9996C30.0666 29.1996 31.0666 30.7329 31.2333 32.2996Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M19.9997 36.6673C29.2044 36.6673 36.6663 29.2054 36.6663 20.0007C36.6663 10.7959 29.2044 3.33398 19.9997 3.33398C10.7949 3.33398 3.33301 10.7959 3.33301 20.0007C3.33301 29.2054 10.7949 36.6673 19.9997 36.6673Z"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
  </svg>
</template>
