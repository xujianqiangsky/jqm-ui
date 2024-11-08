import { request } from '@/api/request';

export function getUserById(id: string) {
  return request.get<Result<User>>(`/admin/user/${id}`);
}

export function editUserById(user: User) {
  return request.put('/admin/user/change', user);
}

export function removeUserById(id: string) {
  return request.delete(`/admin/user/${id}`);
}

export function changeUserStatus(id: string, status: number) {
  return request.put(`/admin/user/status/${id}/${status}`);
}

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
