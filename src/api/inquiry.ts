import instance from './instance';

export interface InquiryResponse {
  id: number;
  inquiryCode: string;
  userId: number;
  userName: string;
  userEmail: string;
  orderId?: number;
  orderNo?: string;
  category: string;
  title: string;
  content: string;
  status: 'PENDING' | 'ANSWERED' | 'CLOSED';
  isSecret: boolean;
  answerContent?: string;
  answeredByName?: string;
  answeredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryRequest {
  title: string;
  content: string;
  category: string;
  orderNo?: string;
  isSecret?: boolean;
}

export const INQUIRY_CATEGORIES: { value: string; label: string }[] = [
  { value: 'ORDER',    label: '주문 문의' },
  { value: 'PRODUCT',  label: '상품 문의' },
  { value: 'PAYMENT',  label: '결제 문의' },
  { value: 'DELIVERY', label: '배송 문의' },
  { value: 'RETURN',   label: '반품/교환' },
  { value: 'OTHER',    label: '기타' },
];

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  INQUIRY_CATEGORIES.map(c => [c.value, c.label])
);

/** 문의 등록 */
export async function createInquiry(data: CreateInquiryRequest): Promise<InquiryResponse> {
  const res = await instance.post<{ data: InquiryResponse }>('/api/v1/inquiries', data);
  return res.data.data;
}

/** 내 문의 목록 */
export async function getMyInquiries(page = 0, size = 10) {
  const res = await instance.get('/api/v1/inquiries', { params: { page, size } });
  return res.data.data as {
    content: InquiryResponse[];
    totalPages: number;
    totalElements: number;
    page: number;
  };
}

/** 내 문의 상세 */
export async function getMyInquiry(inquiryCode: string): Promise<InquiryResponse> {
  const res = await instance.get<{ data: InquiryResponse }>(`/api/v1/inquiries/${inquiryCode}`);
  return res.data.data;
}

/** 문의 삭제 */
export async function deleteMyInquiry(inquiryCode: string): Promise<void> {
  await instance.delete(`/api/v1/inquiries/${inquiryCode}`);
}
