import { request } from '@/api/request';

export function login(user: LoginUser) {
  return request.post<Result<TokenInfo>>('/approve/auth/login', user);
}

export function logout() {
  return request.get<Result<Object>>('/approve/auth/logout');
}
