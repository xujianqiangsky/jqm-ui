import { createRouter, createWebHistory } from 'vue-router';
import { useTabsStore } from '@/stores/tabs';
import { useTitle } from '@vueuse/core';
import { getAuthenticationStatus } from '@/utils/tokenUtils';
import { getDynamicRoutes } from './dynamicRoutes';
import { clearAllCache } from '@/utils/clearCache';

const routes = [
  {
    name: 'layout',
    path: '/',
    redirect: '/home',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: []
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
      icon: 'ant-design:login-outlined',
      hidden: true
    },
    component: () => import('@/views/LoginView.vue')
  },
  {
    name: '404',
    path: '/:pathMatch(.*)*',
    meta: {
      title: 'Not Found',
      icon: 'ep:notification',
      hidden: true
    },
    component: () => import('@/views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由初始化标志位
let isInitial = true;

router.beforeEach(async (to, from) => {
  // 验证用户是否登录
  const isAuthenticated = getAuthenticationStatus();
  if (isAuthenticated && to.path === '/login') {
    return { path: from.fullPath, replace: true };
  }
  if (!isAuthenticated && to.path !== '/login') {
    clearAllCache();
    return { path: '/login', replace: true };
  }

  if (isAuthenticated && isInitial) {
    isInitial = false;
    const dynamicRoutes = await getDynamicRoutes();
    for (const route of dynamicRoutes) {
      router.addRoute('layout', route);
    }
    return to.fullPath;
  }

  // 动态添加标签页
  if (!to.meta.hidden) {
    const useTabs = useTabsStore();
    const tabs: Tabs = {
      name: to.name,
      title: to.meta.title,
      path: to.fullPath,
      active: true
    };
    useTabs.addTabs(tabs);
  }
  // 动态修改标签页标题
  useTitle(to.meta.title, { titleTemplate: '%s | JQM' });
});

export default router;
