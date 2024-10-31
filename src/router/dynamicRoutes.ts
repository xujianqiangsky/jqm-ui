import type { RouteRecordRaw } from 'vue-router';
import { getMenuDetail } from '@/api/core/menu';
import { getMenuCache, saveMenuCache } from '@/utils/menuUtils';

export async function getDynamicRoutes() {
  let menuList = getMenuCache();
  if (menuList.length === 0) {
    const response = await getMenuDetail();
    if (response.data.data) {
      menuList = response.data.data as Array<MenuDetail>;
      saveMenuCache(menuList);
    }
  }
  return handleRoutes(menuList, '');
}

function handleRoutes(menuList: MenuDetail[], path: string) {
  const routes: RouteRecordRaw[] = [];
  for (const menu of menuList) {
    if (menu.type === 1) {
      const viewName = menu.path.slice(0, 1).toUpperCase() + menu.path.slice(1) + 'View';
      const viewPath = '../views/' + path + '/' + viewName + '.vue';
      const route: RouteRecordRaw = {
        name: menu.id,
        path: menu.path,
        meta: {
          title: menu.name,
          icon: menu.icon
        },

        component: () => import(/* @vite-ignore */ viewPath)
      };
      routes.push(route);
    }
    if (menu.type === 0) {
      path = path + '/' + menu.path;
      const route: RouteRecordRaw = {
        name: menu.id,
        path: menu.path,
        meta: {
          title: menu.name,
          icon: menu.icon
        },
        children: handleRoutes(menu.children, menu.path)
      };
      routes.push(route);
    }
  }
  return routes;
}
