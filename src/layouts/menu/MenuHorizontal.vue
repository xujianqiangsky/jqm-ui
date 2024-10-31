<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useLayoutStore } from '@/stores/layout';
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import { logout } from '@/api/core/auth';
import { useRouter } from 'vue-router';
import { clearAllCache } from '@/utils/clearCache';
import { useUserStore } from '@/stores/user';

const useLayout = useLayoutStore();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();
const router = useRouter();
const userStore = useUserStore();

async function doLogout() {
  const response = await logout();
  if (response.data.data === 'ok') {
    clearAllCache();
    ElNotification.success({ message: '登出成功' });
    router.replace({ path: '/login' });
  }
}
</script>

<template>
  <el-menu mode="horizontal" :ellipsis="false" menu-trigger="click" close-on-click-outside>
    <el-menu-item index="0" @click="useLayout.toggleMenu">
      <el-icon class="menu-icon" :class="{ 'is-collapse': useLayout.layout.collapse }">
        <icon icon="ep:fold"></icon>
      </el-icon>
    </el-menu-item>
    <!-- 
    内联事件: toggleDark()。
    内联事件处理器：事件被触发时执行的内联 JavaScript 语句 (与 onclick 类似)。
    内联事件处理器中访问原生 DOM 事件。你可以向该处理器方法传入一个特殊的 $event 变量，或者使用内联箭头函数。
    方法事件: toggleFullscreen。
    方法事件处理器：一个指向组件上定义的方法的属性名或是路径。
    方法事件处理器会自动接收原生 DOM 事件并触发执行。
     -->
    <el-menu-item index="1" @click="toggleDark()">
      <el-icon>
        <transition name="menu" mode="out-in">
          <icon v-if="isDark" icon="ant-design:sun-filled" />
          <icon v-else icon="ant-design:moon-filled" />
        </transition>
      </el-icon>
    </el-menu-item>
    <el-menu-item index="2" @click="toggleFullscreen">
      <el-icon>
        <transition name="menu" mode="out-in">
          <icon v-if="isFullscreen" icon="ant-design:fullscreen-exit-outlined" />
          <icon v-else icon="ant-design:fullscreen-outlined" />
        </transition>
      </el-icon>
    </el-menu-item>
    <el-sub-menu index="3" class="user-info">
      <template #title>
        <el-avatar :src="userStore.userInfo.avatar" />
        <span class="user-info__name">{{ userStore.userInfo.username }}</span>
      </template>
      <el-menu-item index="3-2" @click="doLogout">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.user-info__name {
  margin-left: 0.8em;
}

.menu-icon {
  transition: transform var(--el-transition-duration)
    var(--el-transition-function-ease-in-out-bezier);
}

.menu-icon.is-collapse {
  transform: rotate(-180deg);
}

.menu-enter-active,
.menu-leave-active {
  transition:
    transform var(--jqm-transition-duration-medium) var(--el-transition-function-ease-in-out-bezier),
    opacity var(--jqm-transition-duration-medium) var(--el-transition-function-ease-in-out-bezier);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}

/* 覆盖 element plus 默认样式 */
.el-icon {
  margin-right: 0;
}
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
