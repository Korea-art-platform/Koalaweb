export type ArtworkStatus = 'available' | 'sold' | 'exhibition';
export type ArtworkSaleType = 'original' | 'limited' | 'goods' | 'sculpture' | 'digital';

export type Artwork = {
  id: string;
  artistId: string;
  artistName: string;

  title: string;
  subtitle?: string;
  description: string;

  category: string;
  tags: string[];

  thumbnailImage: string;
  detailImages: string[];

  price?: number;
  currency: 'KRW' | 'USD';

  status: ArtworkStatus;
  saleType: ArtworkSaleType;

  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  weightKg?: number;

  material?: string;
  edition?: string;
  year?: number;

  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;

  createdAt: string;
};
