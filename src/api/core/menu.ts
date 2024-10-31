import { request } from '@/api/request';

export function getMenuDetail() {
  return request.get<Result<Object>>('/admin/menu/detail');
}
