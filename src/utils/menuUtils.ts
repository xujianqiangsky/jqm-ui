import { useStorage } from '@vueuse/core';
import { MENU_PREFIX } from '@/constants/cachePrefix';

export function getMenuCache() {
  const menuList = useStorage<MenuDetail[]>(MENU_PREFIX, []);
  return menuList.value;
}

export function saveMenuCache(routes: MenuDetail[]) {
  const menuList = useStorage<MenuDetail[]>(MENU_PREFIX, []);
  menuList.value = routes;
}

export function clearMenuCache() {
  const menuList = useStorage<MenuDetail[]>(MENU_PREFIX, []);
  menuList.value = null;
}
