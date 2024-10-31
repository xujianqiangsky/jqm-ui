import { request } from '@/api/request';

export function getLoginUserInfo() {
  return request.get<Result<User>>('/admin/user');
}

export function listUsers(pageNum: number, pageSize: number) {
  return request.get<Result<IPage<User>>>(`/admin/user/list/${pageNum}/${pageSize}`);
}

export function listUserDetails(pageNum: number, pageSize: number) {
  return request.get<Result<IPage<User>>>(`/admin/user/list/detail/${pageNum}/${pageSize}`);
}

export function saveUser(user: User) {
  return request.post('/admin/user', user);
}
