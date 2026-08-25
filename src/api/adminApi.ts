import adminInstance from './adminInstance';
import type { Category, CategoryGroups } from './category';

const BASE = '/admin/api/v1';

export async function adminLogin(loginId: string, password: string) {
  const res = await adminInstance.post<{ data: { accessToken: string } }>(
    `${BASE}/auth/login`,
    { loginId, password }
  );
  return res.data.data;
}

export async function getAdminMe() {
  const res = await adminInstance.get<{ data: AdminMe }>(`${BASE}/me`);
  return res.data.data;
}

export const adminLogout = () =>
  adminInstance.post(`${BASE}/auth/logout`)

export async function getAdminOrders(
  page = 0,
  size = 20,
  search?: { userId?: number; name?: string; phone?: string }
) {
  const res = await adminInstance.get(`${BASE}/orders`, {
    params: { page, size, ...search },
  });
  return res.data.data;
}

export async function getAdminOrder(orderNo: string) {
  const res = await adminInstance.get(`${BASE}/orders/${orderNo}`);
  return res.data.data;
}

export async function adminCancelOrder(
  orderNo: string,
  reason: string,
  cancelAmount?: number
) {
  const res = await adminInstance.post(`${BASE}/orders/${orderNo}/cancel`, {
    reason,
    cancelAmount: cancelAmount ?? null,
  });
  return res.data.data;
}

export async function registerTracking(orderNo: string, carrierCode: string, trackingNo: string) {
  await adminInstance.patch(`${BASE}/orders/${orderNo}/tracking`, { carrierCode, trackingNo });
}

export async function markDelivered(orderNo: string) {
  await adminInstance.patch(`${BASE}/orders/${orderNo}/delivered`);
}

export type Carrier = { code: string; name: string };

export async function getCarriers(): Promise<Carrier[]> {
  const res = await adminInstance.get(`${BASE}/orders/carriers`);
  return res.data.data ?? [];
}

export async function getAdminSkus(page = 0, size = 20) {
  const res = await adminInstance.get(`${BASE}/skus`, { params: { page, size } });
  return res.data.data;
}

export async function createSku(body: Record<string, unknown>) {
  const res = await adminInstance.post(`${BASE}/skus`, body);
  return res.data.data;
}

export async function updateSku(skuCode: string, body: Record<string, unknown>) {
  const res = await adminInstance.put(`${BASE}/skus/${skuCode}`, body);
  return res.data.data;
}

export async function publishSku(skuCode: string) {
  await adminInstance.patch(`${BASE}/skus/${skuCode}/publish`);
}

export async function discontinueSku(skuCode: string) {
  await adminInstance.patch(`${BASE}/skus/${skuCode}/discontinue`);
}

export async function deleteSku(skuCode: string) {
  await adminInstance.delete(`${BASE}/skus/${skuCode}`);
}

export async function getAdminCategories() {
  const res = await adminInstance.get(`${BASE}/categories`);
  return res.data.data as CategoryGroups;
}

export async function createCategory(body: {
  type: 'MAIN' | 'SUB';
  code: string;
  name: string;
  sortOrder?: number;
}) {
  const res = await adminInstance.post(`${BASE}/categories`, body);
  return res.data.data as Category;
}

export async function updateCategory(
  id: number,
  body: { name?: string; sortOrder?: number; isActive?: boolean }
) {
  const res = await adminInstance.patch(`${BASE}/categories/${id}`, body);
  return res.data.data as Category;
}

export async function deactivateCategory(id: number) {
  await adminInstance.delete(`${BASE}/categories/${id}`);
}

export async function getSkuMedia(skuCode: string) {
  const res = await adminInstance.get(`${BASE}/skus/${skuCode}/media`);
  return res.data.data as SkuMediaItem[];
}

export async function addSkuMedia(
  skuCode: string,
  file: File,
  meta: { mediaType: string; mediaRole: string; altText?: string; sortOrder?: number; isPrimary?: boolean }
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('meta', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  const res = await adminInstance.post(`${BASE}/skus/${skuCode}/media`, formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data.data as SkuMediaItem;
}

export async function deleteSkuMedia(skuCode: string, mediaId: number) {
  await adminInstance.delete(`${BASE}/skus/${skuCode}/media/${mediaId}`);
}

export async function adjustStock(skuCode: string, delta: number, memo?: string) {
  await adminInstance.post(`${BASE}/skus/stock-adjust`, { skuCode, delta, memo });
}

export async function getAdminArtists(page = 0, size = 50) {
  const res = await adminInstance.get(`${BASE}/artists`, { params: { page, size } });
  return res.data.data;
}

export async function getAdminArtist(artistCode: string) {
  const res = await adminInstance.get(`/api/v1/artists/${artistCode}`);
  return res.data.data as ArtistDetailResponse;
}

export async function createArtist(body: {
  name: string;
  slug: string;
  description?: string;
  artistNote?: string;
  profileImageUrl?: string;
}) {
  const res = await adminInstance.post(`${BASE}/artists`, body);
  return res.data.data;
}

export async function updateArtist(artistCode: string, body: {
  name: string;
  slug: string;
  description?: string;
  artistNote?: string;
  profileImageUrl?: string;
}) {
  const res = await adminInstance.put(`${BASE}/artists/${artistCode}`, body);
  return res.data.data;
}

export async function deleteArtist(artistCode: string) {
  await adminInstance.delete(`${BASE}/artists/${artistCode}`);
}

export async function getArtistMedia(artistCode: string) {
  const res = await adminInstance.get(`${BASE}/artists/${artistCode}/media`);
  return res.data.data as ArtistMediaResponse[];
}

export async function addArtistMedia(
  artistCode: string,
  file: File,
  meta: { mediaType: string; mediaRole: string; title?: string; thumbnailUrl?: string; sortOrder?: number }
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('meta', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  const res = await adminInstance.post(`${BASE}/artists/${artistCode}/media`, formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data.data as ArtistMediaResponse;
}

export async function addArtistMediaUrl(
  artistCode: string,
  data: { fileUrl: string; mediaType: string; mediaRole: string; title?: string; thumbnailUrl?: string; sortOrder?: number }
) {
  const res = await adminInstance.post(`${BASE}/artists/${artistCode}/media-url`, data);
  return res.data.data as ArtistMediaResponse;
}

export async function updateArtistMediaThumbnail(
  artistCode: string,
  mediaId: number,
  thumbnailUrl: string
) {
  const res = await adminInstance.patch(
    `${BASE}/artists/${artistCode}/media/${mediaId}/thumbnail`,
    { thumbnailUrl }
  );
  return res.data.data as ArtistMediaResponse;
}

export async function deleteArtistMedia(artistCode: string, mediaId: number) {
  await adminInstance.delete(`${BASE}/artists/${artistCode}/media/${mediaId}`);
}

export async function addArtistCareer(artistCode: string, body: {
  category: string;
  year: number | null;
  content: string;
  sortOrder?: number;
}) {
  const res = await adminInstance.post(`${BASE}/artists/${artistCode}/careers`, body);
  return res.data.data as ArtistCareerResponse;
}

export async function updateArtistCareer(artistCode: string, careerId: number, body: {
  category: string;
  year: number | null;
  content: string;
  sortOrder?: number;
}) {
  const res = await adminInstance.put(`${BASE}/artists/${artistCode}/careers/${careerId}`, body);
  return res.data.data as ArtistCareerResponse;
}

export async function deleteArtistCareer(artistCode: string, careerId: number) {
  await adminInstance.delete(`${BASE}/artists/${artistCode}/careers/${careerId}`);
}

export async function getAdminUsers(page = 0, size = 20) {
  const res = await adminInstance.get(`${BASE}/users`, { params: { page, size } });
  return res.data.data;
}

export async function getAdminUser(userId: number){
  const res = await adminInstance.get(`${BASE}/users/${userId}`);
  return res.data.data;
}

export async function getAdminUserOrders(userId: number, page = 0, size = 10){
  const res = await adminInstance.get(`${BASE}/orders`, {params: {userId, page, size}});
  return res.data.data;
}

export async function suspendUser(userId: number) {
  await adminInstance.patch(`${BASE}/users/${userId}/suspend`);
}

export async function activateUser(userId: number) {
  await adminInstance.patch(`${BASE}/users/${userId}/activate`);
}

export interface DashboardStats{
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  totalOrders: number;
  monthRevenue: number;
  totalRevenue: number;
  todaySignups: number;
  totalUsers: number;
  pendingOrders: number;
  processingOrders: number;
}
export interface DailyRevenue{
  date: string;
  revenue: number;
  orderCount: number;
}
export async function getDashboardStats() {
  const res = await adminInstance.get<{ data: DashboardStats }>(`${BASE}/dashboard/stats`);
  return res.data.data;
}
export async function getDailyRevenue() {
  const res = await adminInstance.get<{ data: DailyRevenue[] }>(`${BASE}/dashboard/daily-revenue`);
  return res.data.data;
}

export type SkuImportRowError = {
  rowNumber: number;
  field: string;
  rejectedValue: unknown;
  reason: string;
};

export type SkuImportResult = {
  totalRows: number;
  succeeded: number;
  failed: number;
  errors: SkuImportRowError[];
};

export async function importSkusCsv(file: File) {
  const form = new FormData();
  form.append('file', file);

  const res = await adminInstance.post<{ data: SkuImportResult }>(
    `${BASE}/skus/bulk`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 180_000 },
  );
  return res.data.data;
}

export async function downloadSkuCsvTemplate() {
  const res = await adminInstance.get(`${BASE}/skus/bulk/template`, {
    responseType: 'blob',
  });

  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sku-bulk-template.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export type PaymentNeedingAttention = {
  paymentNo: string;
  orderNo: string;
  provider: string;
  method: string;
  status: string;
  requestedAmount: number;
  failureCode?: string | null;
  failureMessage?: string | null;
  createdAt?: string | null;
};

export async function getPaymentsNeedingAttention() {
  const res = await adminInstance.get<{ data: PaymentNeedingAttention[] }>(
    `${BASE}/payments/attention`,
  );
  return res.data.data;
}

export async function resolveStuckPayment(
  paymentNo: string,
  outcome: 'CAPTURED' | 'CANCELLED' | 'FAILED',
  memo?: string,
) {
  const res = await adminInstance.post(`${BASE}/payments/${paymentNo}/resolve`, { outcome, memo });
  return res.data.data;
}

export async function getAdminBanners() {
  const res = await adminInstance.get(`${BASE}/banners`);
  return res.data.data as BannerResponse[];
}

export async function createBanner(body: {
  bannerType: string;
  title: string;
  imageUrl?: string;
  videoUrl?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  linkUrl?: string;
  linkTarget?: string;
  sortOrder?: number;
}) {
  const res = await adminInstance.post(`${BASE}/banners`, body);
  return res.data.data;
}

export async function updateBanner(bannerCode: string, body: Record<string, unknown>) {
  const res = await adminInstance.put(`${BASE}/banners/${bannerCode}`, body);
  return res.data.data;
}

export async function activateBanner(bannerCode: string) {
  await adminInstance.patch(`${BASE}/banners/${bannerCode}/activate`);
}

export async function deactivateBanner(bannerCode: string) {
  await adminInstance.patch(`${BASE}/banners/${bannerCode}/deactivate`);
}

export async function deleteBanner(bannerCode: string) {
  await adminInstance.delete(`${BASE}/banners/${bannerCode}`);
}

export async function uploadBannerImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await adminInstance.post<{ data: { imageUrl: string } }>(
    `${BASE}/banners/upload-image`,
    formData,
    { headers: { 'Content-Type': undefined } }
  );
  return res.data.data.imageUrl;
}

export interface PartnerStore {
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
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreInput {
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
  sortOrder?: number;
}

export async function getAdminStores(): Promise<PartnerStore[]> {
  const res = await adminInstance.get(`${BASE}/stores`);
  return res.data.data as PartnerStore[];
}

export async function createStore(data: StoreInput): Promise<PartnerStore> {
  const res = await adminInstance.post(`${BASE}/stores`, data);
  return res.data.data as PartnerStore;
}

export async function updateStore(storeCode: string, data: StoreInput): Promise<PartnerStore> {
  const res = await adminInstance.put(`${BASE}/stores/${storeCode}`, data);
  return res.data.data as PartnerStore;
}

export async function activateStore(storeCode: string) {
  await adminInstance.patch(`${BASE}/stores/${storeCode}/activate`);
}

export async function deactivateStore(storeCode: string) {
  await adminInstance.patch(`${BASE}/stores/${storeCode}/deactivate`);
}

export async function deleteStore(storeCode: string) {
  await adminInstance.delete(`${BASE}/stores/${storeCode}`);
}

export async function reorderStores(storeCodes: string[]) {
  await adminInstance.post(`${BASE}/stores/reorder`, { storeCodes });
}

export async function updateBannerImage(bannerCode: string, file: File): Promise<BannerResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await adminInstance.patch(`${BASE}/banners/${bannerCode}/image`, formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data.data as BannerResponse;
}

export async function activateArtist(artistCode: string) {
  await adminInstance.patch(`${BASE}/artists/${artistCode}/activate`);
}

export async function deactivateArtist(artistCode: string) {
  await adminInstance.patch(`${BASE}/artists/${artistCode}/deactivate`);
}

export async function getArtistSkus(artistCode: string): Promise<ArtistSkuItem[]> {
  const res = await adminInstance.get(`${BASE}/artists/${artistCode}/skus`);
  return res.data.data;
}

export async function setArtistFeaturedSku(artistCode: string, skuCode: string) {
  const res = await adminInstance.put(`${BASE}/artists/${artistCode}/featured-sku`, { skuCode });
  return res.data.data as FeaturedSkuInfo;
}

export async function clearArtistFeaturedSku(artistCode: string) {
  await adminInstance.delete(`${BASE}/artists/${artistCode}/featured-sku`);
}

export async function getAdminReturns(page = 0, size = 20, status?: string) {
  const res = await adminInstance.get(`${BASE}/returns`, {
    params: { page, size, ...(status ? { status } : {}) },
  });
  return res.data.data;
}

export async function getAdminReturn(returnNo: string) {
  const res = await adminInstance.get(`${BASE}/returns/${returnNo}`);
  return res.data.data;
}

export async function processReturn(
  returnNo: string,
  action: 'APPROVE' | 'REJECT',
  refundAmount?: number,
  adminMemo?: string
) {
  const res = await adminInstance.patch(`${BASE}/returns/${returnNo}/process`, {
    action,
    refundAmount: refundAmount ?? null,
    adminMemo: adminMemo ?? null,
  });
  return res.data.data;
}

export async function completeReturn(returnNo: string) {
  const res = await adminInstance.patch(`${BASE}/returns/${returnNo}/complete`);
  return res.data.data;
}

export async function getPendingReviews(page = 0, size = 20) {
  const res = await adminInstance.get(`${BASE}/reviews/pending`, { params: { page, size } });
  return res.data.data;
}

export async function moderateReview(reviewCode: string, action: 'APPROVE' | 'HIDE' | 'REJECT', memo?: string) {
  const res = await adminInstance.patch(`${BASE}/reviews/${reviewCode}/moderate`, { action, memo });
  return res.data.data;
}

export async function setFeaturedReview(reviewCode: string, featured: boolean) {
  await adminInstance.patch(`${BASE}/reviews/${reviewCode}/featured`, null, { params: { featured } });
}

export async function getAuditLogs(page = 0, size = 20) {
  const res = await adminInstance.get(`${BASE}/audit-logs`, { params: { page, size } });
  return res.data.data;
}

export interface SkuMediaItem {
  id: number;
  mediaType: string;
  mediaRole: string;
  fileUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ArtistMediaResponse {
  id: number;
  mediaType: string;
  mediaRole: string;
  fileUrl: string;
  thumbnailUrl?: string;
  title?: string;
  sortOrder: number;
}

export interface ArtistCareerResponse {
  id: number;
  category: '학력' | '개인전' | '그룹전' | '수상' | '소장' | '방송' | '그 외';
  year: number | null;
  content: string;
  sortOrder: number;
}

export interface FeaturedSkuInfo {
  skuCode: string;
  name: string;
  listPrice: number;
  salePrice?: number;
  imageUrl?: string;
  description?: string;
}

export interface ArtistSkuItem {
  skuCode: string;
  name: string;
  listPrice: number;
  salePrice?: number;
  imageUrl?: string;
  status: string;
}

export interface ArtistDetailResponse {
  id: number;
  artistCode: string;
  name: string;
  slug: string;
  description?: string;
  artistNote?: string;
  profileImageUrl?: string;
  isActive: boolean;
  mediaList: ArtistMediaResponse[];
  careerList: ArtistCareerResponse[];
  followCount: number;
  isFollowing: boolean;
  featuredSku?: FeaturedSkuInfo;
}

export interface AdminMe {
  id: number;
  adminCode: string;
  loginId: string;
  name: string;
  email: string;
  status: string;
  roles: string[];
}

export interface BannerResponse {
  id: number;
  bannerCode: string;
  bannerType: string;
  title: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageUrl: string;
  videoUrl?: string;
  mobileImageUrl?: string;
  linkUrl?: string;
  linkTarget?: string;
  bgColor?: string;
  textColor?: string;
  sortOrder?: number;
  isActive: boolean;
  visibleFrom?: string;
  visibleTo?: string;
  createdAt: string;
}

export interface NoticeResponse {
  id: number;
  noticeCode: string;
  title: string;
  content: string;
  isPinned: boolean;
  isActive: boolean;
  createdByAdminName?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAdminNotices() {
  const res = await adminInstance.get(`${BASE}/notices`);
  return res.data.data as NoticeResponse[];
}

export async function createNotice(body: { title: string; content: string; isPinned?: boolean }) {
  const res = await adminInstance.post(`${BASE}/notices`, body);
  return res.data.data as NoticeResponse;
}

export async function updateNotice(noticeCode: string, body: { title: string; content: string; isPinned?: boolean }) {
  const res = await adminInstance.put(`${BASE}/notices/${noticeCode}`, body);
  return res.data.data as NoticeResponse;
}

export async function activateNotice(noticeCode: string) {
  await adminInstance.patch(`${BASE}/notices/${noticeCode}/activate`);
}

export async function deactivateNotice(noticeCode: string) {
  await adminInstance.patch(`${BASE}/notices/${noticeCode}/deactivate`);
}

export async function deleteNotice(noticeCode: string) {
  await adminInstance.delete(`${BASE}/notices/${noticeCode}`);
}

export interface AdminInquiryResponse {
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

export async function getAdminInquiries(page = 0, size = 20, status?: string) {
  const res = await adminInstance.get(`${BASE}/inquiries`, {
    params: { page, size, ...(status ? { status } : {}) },
  });
  return res.data.data as {
    content: AdminInquiryResponse[];
    totalPages: number;
    totalElements: number;
    page: number;
  };
}

export async function getAdminInquiry(inquiryCode: string) {
  const res = await adminInstance.get(`${BASE}/inquiries/${inquiryCode}`);
  return res.data.data as AdminInquiryResponse;
}

export async function answerInquiry(inquiryCode: string, answerContent: string) {
  const res = await adminInstance.post(`${BASE}/inquiries/${inquiryCode}/answer`, { answerContent });
  return res.data.data as AdminInquiryResponse;
}

export async function closeInquiry(inquiryCode: string) {
  await adminInstance.patch(`${BASE}/inquiries/${inquiryCode}/close`);
}

export type ArtistSettlement = {
  settlementId: number | null;
  artistId: number;
  artistName: string;
  periodYm: string;
  grossAmount: string;
  refundAmount: string;
  netAmount: string;
  commissionRate: string;
  commissionAmount: string;
  payoutAmount: string;
  confirmed: boolean;
  status: string | null;
  paidAt: string | null;
  memo: string | null;
};

export type SettlementPeriod = {
  periodYm: string;
  confirmed: boolean;
  artistCount: number;
  totalGross: string;
  totalRefund: string;
  totalCommission: string;
  totalPayout: string;
  items: ArtistSettlement[];
};

export async function getSettlementPeriod(periodYm: string) {
  const res = await adminInstance.get(`${BASE}/settlements/${periodYm}`);
  return res.data.data as SettlementPeriod;
}

export async function confirmSettlement(periodYm: string) {
  const res = await adminInstance.post(`${BASE}/settlements/${periodYm}/confirm`);
  return res.data.data as SettlementPeriod;
}

export async function markSettlementPaid(settlementId: number, memo?: string) {
  await adminInstance.patch(`${BASE}/settlements/${settlementId}/paid`, { memo: memo ?? null });
}

export async function changeCommissionRate(artistId: number, commissionRate: number) {
  await adminInstance.patch(`${BASE}/settlements/artists/${artistId}/commission-rate`, { commissionRate });
}
