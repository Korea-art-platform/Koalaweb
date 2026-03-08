import Navigation from '../components/layouts/Header';
import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Package,
  Shield,
  Globe,
  Box,
  ExternalLink,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { artworks } from '../../data/artworks/artworks';
import type { Artwork } from './type/artwork';

function formatPrice(price?: number, currency: 'KRW' | 'USD' = 'KRW') {
  if (!price) return 'Price on Request';
  return currency === 'KRW'
    ? `₩${price.toLocaleString()}`
    : `$${price.toLocaleString()}`;
}

function formatDimensions(product: Artwork) {
  const sizes = [product.widthCm, product.heightCm, product.depthCm].filter(
    (value): value is number => typeof value === 'number'
  );

  if (sizes.length === 3) {
    return `${product.widthCm}cm × ${product.heightCm}cm × ${product.depthCm}cm`;
  }

  if (sizes.length === 2) {
    return `${product.widthCm}cm × ${product.heightCm}cm`;
  }

  if (sizes.length === 1) {
    return `${sizes[0]}cm`;
  }

  return '정보 준비 중';
}

function getStatusBadge(status: Artwork['status']) {
  switch (status) {
    case 'available':
      return {
        label: 'Available',
        className: 'bg-green-500/90 text-white',
      };
    case 'sold':
      return {
        label: 'Sold',
        className: 'bg-gray-900/90 text-white',
      };
    case 'exhibition':
      return {
        label: 'On Exhibition',
        className: 'bg-blue-500/90 text-white',
      };
    default:
      return {
        label: 'Unknown',
        className: 'bg-black/80 text-white',
      };
  }
}

function getSaleTypeLabel(saleType: Artwork['saleType']) {
  switch (saleType) {
    case 'original':
      return 'Original Artwork';
    case 'limited':
      return 'Limited Edition';
    case 'goods':
      return 'Art Goods';
    case 'sculpture':
      return 'Sculpture';
    case 'digital':
      return 'Digital';
    default:
      return 'Artwork';
  }
}

function findRelatedOriginalArtwork(currentProduct: Artwork) {
  const priorityOrder: Artwork['saleType'][] = ['original', 'sculpture', 'limited'];

  return artworks
    .filter(
      (item) =>
        item.artistId === currentProduct.artistId &&
        item.id !== currentProduct.id &&
        priorityOrder.includes(item.saleType)
    )
    .sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.saleType);
      const bIndex = priorityOrder.indexOf(b.saleType);
      return aIndex - bIndex;
    })[0];
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const productData = useMemo(
    () => artworks.find((item) => item.id === id),
    [id]
  );

  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [id]);

  const relatedOriginalArtwork = useMemo(() => {
    if (!productData) return undefined;
    return findRelatedOriginalArtwork(productData);
  }, [productData]);

  const handleAddToCart = () => {
    navigate('/cart');
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />

        <div className="pt-32 pb-32 px-8">
          <div className="max-w-[1600px] mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="rounded-3xl border border-gray-200 p-12 text-center">
              <h1 className="text-3xl mb-4">상품 정보를 찾을 수 없습니다.</h1>
              <p className="text-gray-500 mb-8">
                존재하지 않거나 삭제된 상품입니다.
              </p>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                스토어로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(productData.status);
  const saleTypeLabel = getSaleTypeLabel(productData.saleType);
  const images =
    productData.detailImages.length > 0
      ? productData.detailImages
      : [productData.thumbnailImage];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-32 pb-32 px-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-square">
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={productData.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium">
                    {saleTypeLabel}
                  </div>

                  {productData.isNew && (
                    <div className="px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm text-sm">
                      New
                    </div>
                  )}

                  {productData.isFeatured && (
                    <div className="px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm text-sm">
                      Featured
                    </div>
                  )}

                  {productData.isBestSeller && (
                    <div className="px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm text-sm">
                      Best Seller
                    </div>
                  )}
                </div>

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  <div
                    className={`px-4 py-2.5 rounded-full backdrop-blur-sm text-sm ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </div>

                  {productData.detailImages.length > 1 && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm">
                      <Box className="w-4 h-4" />
                      <span className="text-sm">Gallery View</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <button
                    key={`${productData.id}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-xl bg-gray-50 aspect-square ${
                      selectedImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${productData.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="text-sm text-gray-400 tracking-wide uppercase mb-3">
                  {productData.category}
                </div>

                <h1 className="text-4xl mb-4">
                  {productData.title}
                </h1>

                <Link
                  to={`/artist/${productData.artistId}`}
                  className="text-lg text-gray-500 hover:text-black transition-colors"
                >
                  by {productData.artistName}
                </Link>

                {productData.subtitle && (
                  <p className="text-sm text-gray-400 mt-3">
                    {productData.subtitle}
                  </p>
                )}
              </div>

              <div className="text-3xl">
                {formatPrice(productData.price, productData.currency)}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">{saleTypeLabel}</span>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Global Shipping</span>
                </div>

                {productData.edition && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Edition {productData.edition}</span>
                  </div>
                )}
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {productData.description}
              </p>

              {/* Specs */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">Materials</span>
                  <span className="text-right">
                    {productData.material ?? '정보 준비 중'}
                  </span>
                </div>

                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">Dimensions</span>
                  <span className="text-right">{formatDimensions(productData)}</span>
                </div>

                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">Edition</span>
                  <span className="text-right">
                    {productData.edition ?? 'Original / Open'}
                  </span>
                </div>

                <div className="flex justify-between text-sm gap-4">
                  <span className="text-gray-500">Year</span>
                  <span className="text-right">
                    {productData.year ?? '정보 준비 중'}
                  </span>
                </div>

                {productData.weightKg && (
                  <div className="flex justify-between text-sm gap-4">
                    <span className="text-gray-500">Weight</span>
                    <span className="text-right">{productData.weightKg}kg</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button className="p-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>

                <button className="p-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Shipping Info */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <div className="font-medium">International Shipping</div>
                    <div className="text-gray-500">
                      DHL Express • 3-5 business days • Fully insured
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Original Artwork Section */}
          {relatedOriginalArtwork && (
            <div className="mt-32">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl mb-2">
                    View Related Artwork
                  </h2>
                  <p className="text-gray-500">
                    Explore another representative piece by this artist
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[4/3]">
                    <ImageWithFallback
                      src={relatedOriginalArtwork.thumbnailImage}
                      alt={relatedOriginalArtwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-xs text-gray-400 tracking-wide uppercase mb-2">
                        Related Artwork
                      </div>

                      <h3 className="text-3xl mb-3">
                        {relatedOriginalArtwork.title}
                      </h3>

                      <p className="text-gray-500 mb-4">
                        by {relatedOriginalArtwork.artistName}
                      </p>

                      <div className="text-2xl mb-6">
                        {formatPrice(
                          relatedOriginalArtwork.price,
                          relatedOriginalArtwork.currency
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {relatedOriginalArtwork.description}
                    </p>

                    <Link
                      to={`/product/${relatedOriginalArtwork.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                      View Full Artwork
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}