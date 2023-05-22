import axios from 'axios';
import { removeCookie } from './cookie';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BE_HOST,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeCookie();
      window.location.href = '/';
      alert('로그인 정보가 유효하지 않습니다.\n다시 로그인해주세요.');
    }
    return Promise.reject(error);
  },
);
