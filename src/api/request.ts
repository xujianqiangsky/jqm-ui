import axios from 'axios';
import { getTokenInfo } from '@/utils/tokenUtils';
import { clearAllCache } from '@/utils/clearCache';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:12000/api',
  timeout: 3000
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    const tokenInfo = getTokenInfo();
    if (tokenInfo) {
      config.headers['Authorization'] = ['Bearer ', tokenInfo.tokenValue].join('');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    if (response.data.code !== '00000') {
      ElNotification.error({ message: response.data.msg });
    }
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    if (error.status === 401) {
      clearAllCache();
      window.location.href = '/login';
    }
    if (error.response?.data.msg) {
      ElNotification.error({ message: error.response.data.msg });
    }
    return Promise.reject(error);
  }
);

export { instance as request };
