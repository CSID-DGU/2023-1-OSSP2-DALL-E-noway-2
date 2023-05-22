<script setup lang="ts">
const login = () => {
  window.location.replace(
    import.meta.env.VITE_BE_HOST + '/api/auth/google/login',
  );
};
</script>

<template>
  <button class="button" @click="login">
    <img src="@/assets/images/google-login.png" />
  </button>
</template>

<style scoped>
.button {
  padding: 0;
  border: none;
  background-color: transparent;
  cursor: pointer;
}
</style>
