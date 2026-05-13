import adminInstance from './adminInstance';

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
export async function getAdminOrders(page = 0, size = 20) {
  const res = await adminInstance.get(`${BASE}/orders`, { params: { page, size, sort: 'createdAt,desc' } });
  return res.data.data;
}

export async function getAdminOrder(orderNo: string) {
  const res = await adminInstance.get(`${BASE}/orders/${orderNo}`);
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
  // 공개 엔드포인트 사용 (AdminArtistController에 GET 목록 없음)
  const res = await adminInstance.get('/api/v1/artists', { params: { page, size } });
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

export async function deleteArtistMedia(artistCode: string, mediaId: number) {
  await adminInstance.delete(`${BASE}/artists/${artistCode}/media/${mediaId}`);
}

// ── Artist Careers ────────────────────────────────────────────────────────────
export async function addArtistCareer(artistCode: string, body: {
  category: string;
  year: number;
  content: string;
  sortOrder?: number;
}) {
  const res = await adminInstance.post(`${BASE}/artists/${artistCode}/careers`, body);
  return res.data.data as ArtistCareerResponse;
}

export async function updateArtistCareer(artistCode: string, careerId: number, body: {
  category: string;
  year: number;
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

export async function suspendUser(userId: number) {
  await adminInstance.patch(`${BASE}/users/${userId}/suspend`);
}

export async function activateUser(userId: number) {
  await adminInstance.patch(`${BASE}/users/${userId}/activate`);
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
  category: '학력' | '개인전' | '그룹전';
  year: number;
  content: string;
  sortOrder: number;
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
