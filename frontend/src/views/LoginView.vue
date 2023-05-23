<script setup lang="ts">
const login = (socialType: String) => {
  window.location.replace(
    import.meta.env.VITE_BE_HOST + `/api/auth/${socialType}/login`,
  );
};
</script>

<template>
  <div class="wrap">
    <h1 class="explain">Dream Vision 시작하기</h1>
    <div class="space-y-4">
      <button class="social-button social-button-naver" @click="login('naver')">
        <img
          src="@/assets/images/naver-login.svg"
          alt="네이버 아이콘"
          class="social-button-icon"
        />네이버 로그인
      </button>
      <button class="social-button social-button-kakao" @click="login('kakao')">
        <img
          src="@/assets/images/kakao-login.svg"
          alt="카카오 아이콘"
          class="social-button-icon"
        />
        카카오 로그인
      </button>
      <button
        class="social-button social-button-google"
        @click="login('google')"
      >
        <img
          src="@/assets/images/google-login.svg"
          alt="구글 아이콘"
          class="social-button-icon"
        />
        구글 로그인
      </button>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  z-index: 1;
  @apply flex flex-col items-center justify-center h-screen;
}

.explain {
  @apply text-3xl font-bold mb-6 text-white;
}

.social-button {
  @apply w-64 text-black font-bold py-2 px-4 rounded flex items-center justify-center;
}

.social-button-naver {
  @apply bg-[#03C75A] hover:bg-[#02B14E];
}

.social-button-kakao {
  @apply bg-[#FFE812] hover:bg-[#FFD900];
}

.social-button-google {
  @apply bg-white hover:bg-[#BDBDBD];
}

.social-button-icon {
  @apply h-4 w-4 mr-4;
}
</style>
