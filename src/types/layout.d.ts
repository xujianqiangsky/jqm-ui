interface Layout {
  collapse: boolean;
}

interface Tabs {
  name: string | symbol | undefined;
  title: string;
  icon?: string;
  path: string;
  active: boolean;
}
