interface MenuDetail {
  id: string;
  name: string;
  enName: string;
  parentId: string;
  permission: string;
  path: string;
  icon: string;
  sortOrder: string;
  type: number;
  hidden: boolean;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime: string;
  children: Array<MenuDetail>;
}
