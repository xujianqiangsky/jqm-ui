import { request } from '@/api/request';

export function listDepts() {
  return request.get<Result<Array<Dept>>>('/admin/dept/list');
}
