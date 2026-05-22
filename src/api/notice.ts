import instance from './instance';

export interface NoticeItem {
  noticeCode: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getNotices = () =>
  instance.get<{ data: NoticeItem[] }>('/api/v1/notices');

export const getNotice = (noticeCode: string) =>
  instance.get<{ data: NoticeItem }>(`/api/v1/notices/${noticeCode}`);
