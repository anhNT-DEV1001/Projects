export interface Menu {
  id: number;
  title: string;
  href: string;
  icon: string;
  order: number;
  alias: string;
  parentId?: string | null;
  children?: Menu[];
  createdAt: string;
  updatedAt: string;
  createdBy?: number | null;
  updatedBy?: number | null;
  deletedAt?: string | null;
  deletedBy?: number | null;
}

export interface StoreMenuPayload {
  id?: number;
  title?: string;
  href?: string;
  icon?: string;
  order?: number;
  alias?: string;
  parentId?: string | null;
}
