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

export interface AddressRequest {
  label?: string;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address1: string;
  address2?: string;
  isDefault?: boolean;
}

export type SkuStatus = 'ACTIVE' | 'OUT_OF_STOCK' | 'COMING_SOON';

export interface SkuMedia {
  fileUrl: string;
  mediaType: 'VIDEO' | 'IMAGE';
  mediaRole?: string;
}

export interface Sku {
  skuCode: string;
  name: string;

  genre: string;

  mainCategory?: string;

  skuType?: string;
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
  material?: string;
  materialDescription?: string;
  packagingTitle?: string;
  packagingDescription?: string;
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
  category: '학력' | '개인전' | '그룹전' | '그 외';
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
  slug?: string;
}

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

  firstSkuName?: string;
  firstSkuImageUrl?: string;
  itemCount?: number;

  orderItems?: OrderItem[];
  ordererName?: string;
  ordererEmail?: string;
  ordererPhone?: string;
}

// 백엔드 PaymentProvider.getProviderCode() 가 돌려주는 값과 같아야 한다
export type PaymentProvider = 'TOSS' | 'NICEPAY' | 'PAYPLE';
export type PaymentMethodType = 'CARD' | 'TRANSFER' | 'MOBILE_PHONE' | 'TOSSPAY' | 'VBANK';

export type BannerType = 'MAIN' | 'MAIN_SUB' | string;

export interface Banner {
  id: number;
  imageUrl: string;
  videoUrl?: string;
  linkUrl?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
}

export interface WishlistItem {
  skuCode: string;
  skuName: string;
  primaryImageUrl?: string;
  listPrice: number;
  salePrice?: number;
  artistName: string;
}
