import { request } from '@/api/request';

export function presignedByAvatar(filename: string) {
  return request.post<Result<Presigned>>('/storage/oss/presigned/avatar', { filename });
}

export function upload(url: string, data: any) {
  return request.put(url, data);
}
