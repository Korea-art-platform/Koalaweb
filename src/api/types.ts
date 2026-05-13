// ─── 공통 응답 래퍼 ─────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── 인증 ────────────────────────────────────────────────────────────────────
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── 사용자 / 주소 ────────────────────────────────────────────────────────────
export interface UserProfile {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  nickname?: string;
  profileImageUrl?: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  profileImageUrl?: string;
}

export interface Address {
  id?: number;
  label?: string;
  fullName: string;
  phone: string;
  zipCode: string;
  address1: string;
  address2?: string;
  city?: string;
  country: string;
  isDefault?: boolean;
}

export type AddressRequest = Omit<Address, 'id' | 'isDefault'>;

// 백엔드 배송지 응답 (Account 페이지에서 사용)
export interface UserAddress {
  id: number;
  label?: string;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address1: string;
  address2?: string;
  isDefault: boolean;
}

// ─── SKU (상품) ───────────────────────────────────────────────────────────────
export type SkuStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'COMING_SOON';

export interface SkuMedia {
  fileUrl: string;
  mediaType: 'VIDEO' | 'IMAGE';
}

export interface Sku {
  skuCode: string;
  name: string;
  genre: string;
  artistName: string;
  artistCode?: string;
  listPrice: number;
  salePrice?: number;
  status: SkuStatus;
  isLimitedEdition: boolean;
  editionNumber?: number;
  editionSize?: number;
  primaryImageUrl?: string;
  mediaList?: SkuMedia[];
  colorOptions?: string[];
  description?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  weightKg?: number;
  spinePicturesJson?: string[];
}

export interface GenreCount {
  genre: string;
  count: number;
}

export interface Review {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  userName: string;
}

// ─── 장바구니 ─────────────────────────────────────────────────────────────────
export interface CartItem {
  id: number;
  skuCode: string;
  skuName: string;
  primaryImageUrl?: string;
  unitPrice: number;
  lineAmount: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotalAmount: number;
}

// ─── 아티스트 ─────────────────────────────────────────────────────────────────
export interface ArtistMedia {
  mediaType: 'VIDEO' | 'IMAGE';
  mediaRole?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  title?: string;
  sortOrder?: number;
}

export interface ArtistCareer {
  id: number;
  category: '학력' | '개인전' | '그룹전';
  year: number;
  content: string;
  sortOrder: number;
}

export interface Artist {
  artistCode: string;
  name: string;
  description?: string;
  artistNote?: string;
  specialty?: string;
  profileImageUrl?: string;
  studioImageUrl?: string;
  mediaList?: ArtistMedia[];
  careerList?: ArtistCareer[];
  followCount?: number;
  isFollowing?: boolean;
}

// ─── 주문 ─────────────────────────────────────────────────────────────────────
export interface CreateOrderRequest {
  cartItemIds?: number[];
  shippingAddressId?: number;
  [key: string]: unknown;
}

export interface OrderItem {
  skuCode: string;
  skuName: string;
  quantity: number;
  unitPrice: number;
  lineAmount: number;
  primaryImageUrl?: string;
}

export interface Order {
  orderNo: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  items?: OrderItem[];
  // 주문 목록 요약 필드
  firstSkuName?: string;
  firstSkuImageUrl?: string;
  itemCount?: number;
  // 주문 상세 필드
  orderItems?: OrderItem[];
  ordererName?: string;
  ordererEmail?: string;
  ordererPhone?: string;
}

// ─── 결제 ─────────────────────────────────────────────────────────────────────
export type PaymentProvider = 'TOSS' | 'KAKAOPAY' | 'NAVERPAY';
export type PaymentMethodType = 'CARD' | 'VBANK';

// ─── 배너 ─────────────────────────────────────────────────────────────────────
export type BannerType = 'MAIN' | string;

export interface Banner {
  id: number;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
}

// ─── 위시리스트 ───────────────────────────────────────────────────────────────
export interface WishlistItem {
  skuCode: string;
  skuName: string;
  primaryImageUrl?: string;
  listPrice: number;
  salePrice?: number;
  artistName: string;
}
