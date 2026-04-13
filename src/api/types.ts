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
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ─── 사용자 / 주소 ────────────────────────────────────────────────────────────
export interface UserProfile {
  id: number;
  email: string;
  nickname?: string;
  profileImageUrl?: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  profileImageUrl?: string;
}

export interface Address {
  id?: number;
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
  listPrice: number;
  salePrice?: number;
  status: SkuStatus;
  isLimitedEdition: boolean;
  primaryImageUrl?: string;
  mediaList?: SkuMedia[];
  colorOptions?: string[];
  description?: string;
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
  fileUrl: string;
}

export interface Artist {
  artistCode: string;
  name: string;
  bio?: string;
  specialty?: string;
  profileImageUrl?: string;
  studioImageUrl?: string;
  mediaList?: ArtistMedia[];
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
  status: string;
  totalAmount: number;
  createdAt: string;
  items?: OrderItem[];
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
