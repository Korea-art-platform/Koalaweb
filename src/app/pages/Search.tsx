import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { Search as SearchIcon, X, TrendingUp, Clock, ArrowLeft } from 'lucide-react';
import { useViewMode } from '@/app/context/ViewModeContext';
import { useTranslation } from 'react-i18next';
import { fetchAllSkus } from '@/api/fetchAllSkus';
import { getArtists } from '@/api/artist';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

const trendingSearches = ['리미티드 에디션', '아트 토이', '조각', '회화', '도자기'];

export default function Search() {
  const { mode } = useViewMode();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'artworks' | 'artists'>('all');

  const [skus, setSkus] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  useEffect(() => {
    fetchAllSkus()
      .then(setSkus)
      .catch(() => {});
    getArtists(0, 100)
      .then((res) => setArtists(res.data.data?.content ?? res.data.data ?? []))
      .catch(() => {});
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const hasSearched = q.length > 0;

  const skuResults = useMemo(() => {
    if (!q) return [];
    return skus.filter(
      (s) =>
        (s.name ?? '').toLowerCase().includes(q) ||
        (s.artistName ?? '').toLowerCase().includes(q) ||
        (s.genre ?? '').toLowerCase().includes(q),
    );
  }, [skus, q]);

  const artistResults = useMemo(() => {
    if (!q) return [];
    return artists.filter((a) => (a.name ?? '').toLowerCase().includes(q));
  }, [artists, q]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const trimmed = query.trim();
    if (trimmed && !recentSearches.includes(trimmed)) {
      setRecentSearches([trimmed, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => setSearchQuery('');
  const removeRecentSearch = (search: string) =>
    setRecentSearches(recentSearches.filter((s) => s !== search));

  const noResults = hasSearched && skuResults.length === 0 && artistResults.length === 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('search.backToHome')}
            </Link>
            <h1 className="text-4xl tracking-tight mb-6">{t('search.title')}</h1>
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={mode === 'gallery' ? t('search.placeholderGallery') : t('search.placeholderShop')}
                className="w-full pl-16 pr-14 py-5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 transition-colors text-lg"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {!hasSearched ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">

              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm tracking-wide text-gray-400">{t('search.recentSearches')}</h2>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleSearch(search)}
                      >
                        <span className="text-sm">{search}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(search);
                          }}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm tracking-wide text-gray-400">{t('search.trendingNow')}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(trend)}
                      className="px-4 py-2 bg-white rounded-full text-sm hover:bg-koala-navy hover:text-white transition-colors"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-8 border-b border-gray-200">
                {[
                  { key: 'all', label: t('search.filters.all') },
                  { key: 'artworks', label: mode === 'gallery' ? t('search.filters.artworks') : t('search.filters.products') },
                  { key: 'artists', label: t('search.filters.artists') },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                    className={`px-4 py-3 text-sm border-b-2 transition-colors ${
                      activeFilter === filter.key
                        ? 'border-koala-red text-koala-red'
                        : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="space-y-12">

                {(activeFilter === 'all' || activeFilter === 'artists') && artistResults.length > 0 && (
                  <div>
                    <h2 className="text-2xl tracking-tight mb-6">{t('search.filters.artists')}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artistResults.map((artist) => (
                        <Link key={artist.artistCode} to={`/artist/${artist.artistCode}`} className="group">
                          <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all">
                            <div className="w-20 h-20 rounded-full mb-4 mx-auto overflow-hidden bg-gray-100">
                              <ImageWithFallback
                                src={artist.profileImageUrl ?? '/placeholder.svg'}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="text-lg mb-1 text-center group-hover:underline">{artist.name}</h3>
                            {artist.genre && (
                              <p className="text-sm text-gray-400 text-center">{artist.genre}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(activeFilter === 'all' || activeFilter === 'artworks') && skuResults.length > 0 && (
                  <div>
                    <h2 className="text-2xl tracking-tight mb-6">
                      {mode === 'gallery' ? t('search.filters.artworks') : t('search.filters.products')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {skuResults.map((item) => (
                        <Link key={item.skuCode} to={`/product/${item.skuCode}`} className="group">
                          <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                            <div className="aspect-square bg-gray-100 overflow-hidden">
                              <ImageWithFallback
                                src={item.primaryImageUrl ?? '/placeholder.svg'}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm mb-1 group-hover:underline truncate">{item.name}</h3>
                              <p className="text-xs text-gray-400 mb-2">{item.artistName}</p>
                              <p className="text-sm">₩{(item.salePrice ?? item.listPrice ?? 0).toLocaleString()}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {noResults && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <SearchIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 mb-2">
                      {t('search.results.showingAll', { query: searchQuery })}
                    </p>
                    <p className="text-sm text-gray-400">{t('search.results.noResultsDesc')}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
