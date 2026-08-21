import instance from './instance';

export interface StoreItem {
  storeCode: string;
  name: string;
  zipCode?: string;
  address: string;
  addressDetail?: string;
  phone: string;
  phone2?: string;
  email?: string;
  description?: string;
  mapUrl?: string;
  snsUrl?: string;
  imageUrl?: string;
}

export const getStores = () =>
  instance.get<{ data: StoreItem[] }>('/api/v1/stores');
