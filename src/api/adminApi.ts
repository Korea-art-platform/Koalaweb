import adminInstance from './adminInstance';
import type { Category, CategoryGroups } from './category';

const BASE = '/admin/api/v1';

// ── Auth ──────────────────────────────────────────────────────────────────────
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

// ── Orders ────────────────────────────────────────────────────────────────────
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

// ── SKUs ──────────────────────────────────────────────────────────────────────
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

// ── Categories ────────────────────────────────────────────────────────────────
// 공개 API 와 달리 비활성 카테고리도 내려오고, 각 항목에 usedCount 가 붙는다.
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

/** code·type 은 상품이 참조 중이라 바꿀 수 없다 */
export async function updateCategory(
  id: number,
  body: { name?: string; sortOrder?: number; isActive?: boolean }
) {
  const res = await adminInstance.patch(`${BASE}/categories/${id}`, body);
  return res.data.data as Category;
}

/** 실제 삭제가 아니라 비활성화 */
export async function deactivateCategory(id: number) {
  await adminInstance.delete(`${BASE}/categories/${id}`);
}

// ── SKU Media ─────────────────────────────────────────────────────────────────
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
    headers: { 'Content-Type': undefined }, // multipart/form-data + boundary 브라우저 자동 설정
  });
  return res.data.data as SkuMediaItem;
}

export async function deleteSkuMedia(skuCode: string, mediaId: number) {
  await adminInstance.delete(`${BASE}/skus/${skuCode}/media/${mediaId}`);
}

export async function adjustStock(skuCode: string, delta: number, memo?: string) {
  await adminInstance.post(`${BASE}/skus/stock-adjust`, { skuCode, delta, memo });
}

// ── Artists ───────────────────────────────────────────────────────────────────
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

// ── Artist Media ──────────────────────────────────────────────────────────────
export async function getArtistMedia(artistCode: string) {
  const res = await adminInstance.get(`${BASE}/artists/${artistCode}/media`);
  return res.data.data as ArtistMediaResponse[];
}

export async function addArtistMedia(
  artistCode: string,
  file: File,
  meta: { mediaType: string; mediaRole: string; title?: string; sortOrder?: number }
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('meta', new Blob([JSON.stringify(meta)], { type: 'application/json' }));
  const res = await adminInstance.post(`${BASE}/artists/${artistCode}/media`, formData, {
    headers: { 'Content-Type': undefined }, // multipart/form-data + boundary 브라우저 자동 설정
  });
  return res.data.data as ArtistMediaResponse;
}

export async function addArtistMediaUrl(
  artistCode: string,
  data: { fileUrl: string; mediaType: string; mediaRole: string; title?: string; sortOrder?: number }
) {
  const res = await adminInstance.post(`${BASE}/artists/${artistCode}/media-url`, data);
  return res.data.data as ArtistMediaResponse;
}

export async function deleteArtistMedia(artistCode: string, mediaId: number) {
  await adminInstance.delete(`${BASE}/artists/${artistCode}/media/${mediaId}`);
}

// ── Artist Careers ────────────────────────────────────────────────────────────
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

// ── Users ─────────────────────────────────────────────────────────────────────
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

// ── Dashboard ─────────────────────────────────────────────────────────────────
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

// ── 상품 CSV 일괄 등록 ─────────────────────────────────────────────────────────

/** 행 단위 오류 — 어느 행 어느 칸이 왜 틀렸는지 */
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

/**
 * CSV 업로드.
 *
 * 검증 실패도 200 으로 오고 본문에 오류 목록이 담긴다.
 * 파일 자체를 못 읽는 경우(빈 파일·헤더 누락·행 수 초과)만 4xx 로 온다.
 *
 * 서버가 동기로 처리하므로 행이 많으면 오래 걸린다.
 * 기본 인스턴스의 60초로는 부족해 여기서만 늘린다.
 */
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

/**
 * 빈 템플릿 내려받기.
 *
 * 템플릿을 프론트에서 직접 만들지 않고 서버에서 받는다.
 * 양쪽에 두면 컬럼이 바뀔 때 한쪽만 고쳐져 어긋난다.
 */
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

/** PG 응답을 못 받아 승인/취소 여부가 확정되지 않은 결제 — 수동 확인 필요 */
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


// ── Banners ───────────────────────────────────────────────────────────────────
export async function getAdminBanners() {
  const res = await adminInstance.get(`${BASE}/banners`);
  return res.data.data as BannerResponse[];
}

export async function createBanner(body: {
  bannerType: string;
  title: string;
  imageUrl: string;
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

/** 배너 이미지 사전 업로드 → imageUrl 반환 */
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

/** 기존 배너 이미지 교체 */
export async function updateBannerImage(bannerCode: string, file: File): Promise<BannerResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await adminInstance.patch(`${BASE}/banners/${bannerCode}/image`, formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data.data as BannerResponse;
}

/** Artist 공개/비공개 토글 */
export async function activateArtist(artistCode: string) {
  await adminInstance.patch(`${BASE}/artists/${artistCode}/activate`);
}

export async function deactivateArtist(artistCode: string) {
  await adminInstance.patch(`${BASE}/artists/${artistCode}/deactivate`);
}

/** 대표 작품 관리 */
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

// ── Returns ───────────────────────────────────────────────────────────────────
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

// ── Reviews ───────────────────────────────────────────────────────────────────
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

// ── Audit Logs ────────────────────────────────────────────────────────────────
export async function getAuditLogs(page = 0, size = 20) {
  const res = await adminInstance.get(`${BASE}/audit-logs`, { params: { page, size } });
  return res.data.data;
}

// ── Types ─────────────────────────────────────────────────────────────────────
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

// ── Notices ───────────────────────────────────────────────────────────────────
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

// ── Inquiries ─────────────────────────────────────────────────────────────────
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

