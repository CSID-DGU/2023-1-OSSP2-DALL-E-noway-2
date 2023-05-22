<script setup lang="ts">
import GoogleLoginButton from '@/components/login/GoogleLoginButton.vue';
import KakaoLoginButton from '@/components/login/KakaoLoginButton.vue';
import NaverLoginButton from '@/components/login/NaverLoginButton.vue';
import { ref } from 'vue';
</script>

<template>
  <div class="login-container">
    <div class="social-login-wrap">
      <NaverLoginButton class="social-login-button" />
      <KakaoLoginButton class="social-login-button" />
      <GoogleLoginButton class="social-login-button" />
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #ffffff;
}

.social-login-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-login-button {
  width: 80%;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;
}

/* 네이버 로그인 버튼 스타일 */
.social-login-button.naver {
  background-color: #1ec800;
}

/* 카카오 로그인 버튼 스타일 */
.social-login-button.kakao {
  background-color: #fee500;
}

/* 구글 로그인 버튼 스타일 */
.social-login-button.google {
  background-color: #4285f4;
}
</style>
