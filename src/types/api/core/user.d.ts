interface User {
  id?: string;
  username?: string;
  password?: string;
  name?: string;
  deptId?: string;
  gender?: number;
  mobileNumber?: string;
  avatar?: string;
  email?: string;
  status?: number;
  createdBy?: string;
  createdTime?: string;
  updatedBy?: string;
  updatedTime?: string;
}

interface IPage<T> {
  records: Array<T>;
  total: number;
  size: number;
  current: number;
  pages: number;
}
