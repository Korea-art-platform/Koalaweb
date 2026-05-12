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

export async function adjustStock(skuCode: string, delta: number, memo?: string) {
  await adminInstance.post(`${BASE}/skus/stock-adjust`, { skuCode, delta, memo });
}

// ── Artists ───────────────────────────────────────────────────────────────────
export async function getAdminArtists(page = 0, size = 50) {
  // 공개 엔드포인트 사용 (AdminArtistController에 GET 목록 없음)
  const res = await adminInstance.get('/api/v1/artists', { params: { page, size } });
  return res.data.data;
}

export async function createArtist(body: { name: string; slug: string; description?: string; profileImageUrl?: string }) {
  const res = await adminInstance.post(`${BASE}/artists`, body);
  return res.data.data;
}

export async function updateArtist(artistCode: string, body: Record<string, unknown>) {
  const res = await adminInstance.put(`${BASE}/artists/${artistCode}`, body);
  return res.data.data;
}

export async function deleteArtist(artistCode: string) {
  await adminInstance.delete(`${BASE}/artists/${artistCode}`);
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
