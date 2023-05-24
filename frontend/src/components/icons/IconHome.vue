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
      d="M3.33398 36.666H36.6673"
      stroke="white"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M4.91602 36.6648L4.99935 16.6148C4.99935 15.5981 5.48268 14.6315 6.28268 13.9982L17.9493 4.91484C19.1493 3.98151 20.8327 3.98151 22.0493 4.91484L33.716 13.9815C34.5327 14.6148 34.9993 15.5814 34.9993 16.6148V36.6648"
      stroke="white"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M21.6673 28.334H18.334C16.9507 28.334 15.834 29.4507 15.834 30.834V36.6673H24.1673V30.834C24.1673 29.4507 23.0507 28.334 21.6673 28.334Z"
      stroke="white"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M15.834 22.9173H12.5007C11.584 22.9173 10.834 22.1673 10.834 21.2507V18.7507C10.834 17.834 11.584 17.084 12.5007 17.084H15.834C16.7507 17.084 17.5007 17.834 17.5007 18.7507V21.2507C17.5007 22.1673 16.7507 22.9173 15.834 22.9173Z"
      stroke="white"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M27.5 22.9173H24.1667C23.25 22.9173 22.5 22.1673 22.5 21.2507V18.7507C22.5 17.834 23.25 17.084 24.1667 17.084H27.5C28.4167 17.084 29.1667 17.834 29.1667 18.7507V21.2507C29.1667 22.1673 28.4167 22.9173 27.5 22.9173Z"
      stroke="white"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
    <path
      d="M31.6665 11.666L31.6165 6.66602H24.2832"
      stroke="white"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-opacity="props.opacity"
    />
  </svg>
</template>
