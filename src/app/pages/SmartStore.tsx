import Navigation from '../components/layouts/Header';
import { Filter, Grid3x3, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router';
import { useMemo, useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useViewMode } from '../context/ViewModeContext';
import { artworks } from '../../data/artworks/artworks';
import type { Artwork } from './type/artwork';

function getModeItems(mode: 'gallery' | 'shop'): Artwork[] {
  if (mode === 'gallery') {
    return artworks.filter(
      (item) =>
        item.saleType === 'original' ||
        item.saleType === 'sculpture' ||
        item.saleType === 'limited'
    );
  }

  return artworks.filter(
    (item) =>
      item.saleType === 'goods' ||
      item.saleType === 'digital' ||
      item.saleType === 'limited'
  );
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
      return 'Original';
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

export default function SmartStore() {
  const { mode } = useViewMode();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');

  const items = useMemo(() => getModeItems(mode), [mode]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));
    return ['All', ...uniqueCategories];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [categories, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <section className="pt-32 pb-12 px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
              {mode === 'gallery' ? 'The Gallery' : 'Smart Store'}
            </div>

            <h1 className="text-6xl mb-6 tracking-tight">
              {mode === 'gallery' ? 'Original Artworks' : 'Art You Can Own'}
            </h1>

            <p className="text-xl text-gray-500 leading-relaxed">
              {mode === 'gallery'
                ? "Discover original paintings, sculptures, and fine art pieces from Korea's finest artists."
                : 'Curated collection of premium art goods, collectible objects, and lifestyle art pieces.'}
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 pb-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>

              <button
                onClick={() => setViewMode('large')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'large' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
                aria-label="Large view"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 pb-32">
        <div className="max-w-[1600px] mx-auto">
          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-gray-50 px-8 py-20 text-center">
              <h2 className="text-2xl mb-3">해당 카테고리의 작품이 없습니다.</h2>
              <p className="text-gray-500">다른 카테고리를 선택해보세요.</p>
            </div>
          ) : (
            <div
              className={`grid gap-8 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1 md:grid-cols-2'
              }`}
            >
              {filteredItems.map((item) => {
                const statusBadge = getStatusBadge(item.status);
                const saleTypeLabel = getSaleTypeLabel(item.saleType);

                return (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                      <div
                        className={`relative ${
                          viewMode === 'grid' ? 'aspect-square' : 'aspect-[4/3]'
                        }`}
                      >
                        <ImageWithFallback
                          src={item.thumbnailImage}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium">
                            {saleTypeLabel}
                          </div>

                          {item.isNew && (
                            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs">
                              New
                            </div>
                          )}

                          {item.isFeatured && (
                            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs">
                              Featured
                            </div>
                          )}

                          {item.isBestSeller && (
                            <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs">
                              Best Seller
                            </div>
                          )}
                        </div>

                        <div className="absolute top-4 right-4">
                          <div
                            className={`px-3 py-1.5 rounded-full text-xs backdrop-blur-sm ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>

                    <div className="mt-4 px-1">
                      <div className="text-xs text-gray-400 tracking-wide uppercase mb-1">
                        {item.category}
                      </div>

                      <h3 className="text-lg mb-1 group-hover:text-gray-600 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-2">
                        by {item.artistName}
                      </p>

                      <p className="text-lg font-medium">
                        {item.price
                          ? item.currency === 'KRW'
                            ? `₩${item.price.toLocaleString()}`
                            : `$${item.price.toLocaleString()}`
                          : 'Price on Request'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}