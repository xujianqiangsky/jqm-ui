<script setup lang="ts">
import { ref } from 'vue';
import { login } from '@/api/core/auth';
import { saveTokenInfo, setAuthenticationStatus } from '@/utils/tokenUtils';
import { useRouter } from 'vue-router';
import { getDynamicRoutes } from '@/router/dynamicRoutes';
import { useUserStore } from '@/stores/user';
import { getLoginUserInfo } from '@/api/core/user';
import { useThrottleFn } from '@vueuse/core';

const loginUser = ref<LoginUser>({ username: '', password: '' });
const router = useRouter();

const handleLoginEvent = useThrottleFn(async () => {
  const response = await login(loginUser.value);
  const result = response.data;
  if (result.data?.tokenValue) {
    setAuthenticationStatus(true);
    saveTokenInfo(result.data);
    await getDynamicRoutes();
    const { data: userInfoResult } = await getLoginUserInfo();
    const userStore = useUserStore();
    userStore.userInfo = userInfoResult.data;
    ElNotification.success({ message: '登录成功' });
    router.replace('/');
  }
}, 1000);
</script>

<template>
  <div class="container">
    <div class="login">
      <div class="login-header">JQM Admin</div>
      <el-form class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginUser.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginUser.password"
            type="password"
            show-password
            placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="handleLoginEvent">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/images/login.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.login {
  padding: 2em 4em;
  box-shadow: var(--el-box-shadow);
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-mask-color);
}

.login-header {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1em;
}

.login-form {
  min-width: 13.75em;
}

.login-btn {
  width: 100%;
}
</style>
