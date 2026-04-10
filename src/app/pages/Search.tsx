import { useState } from 'react';
import { Link } from 'react-router';
import { Search as SearchIcon, X, TrendingUp, Clock, ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { useViewMode } from '@/app/context/ViewModeContext';

// Mock data for search results
const mockArtworks = [
  { id: 1, title: 'Urban Rhythm', artist: 'Kim Soo-ja', price: 2500000, image: 'abstract painting cityscape' },
  { id: 2, title: 'Hanbok Fusion', artist: 'Park Min-ji', price: 1800000, image: 'korean traditional fashion modern' },
  { id: 3, title: 'Seoul Nights', artist: 'Lee Jae-hyun', price: 3200000, image: 'seoul night photography' },
];

const mockProducts = [
  { id: 1, name: 'Tiger Spirit Figure', artist: 'Kim Soo-ja', price: 89000, image: 'korean tiger toy figure' },
  { id: 2, name: 'Hanbok Bear Limited', artist: 'Park Min-ji', price: 125000, image: 'teddy bear hanbok limited edition' },
  { id: 3, name: 'K-Culture Set', artist: 'Lee Jae-hyun', price: 68000, image: 'korean culture collectible set' },
];

const mockArtists = [
  { id: 1, name: 'Kim Soo-ja', specialty: 'Contemporary Abstract', image: 'asian female artist portrait' },
  { id: 2, name: 'Park Min-ji', specialty: 'Digital & Fashion', image: 'asian female artist digital' },
  { id: 3, name: 'Lee Jae-hyun', specialty: 'Photography', image: 'asian male photographer' },
];

const trendingSearches = [
  'Limited Edition',
  'Korean Traditional',
  'Abstract Art',
  'Designer Toys',
  'Collaboration',
];

export default function Search() {
  const { mode } = useViewMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Kim Soo-ja',
    'Urban Art',
    'Limited Edition Toys',
  ]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'artworks' | 'products' | 'artists'>('all');

  const hasSearched = searchQuery.length > 0;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter(s => s !== search));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <h1 className="text-4xl tracking-tight mb-6">Search</h1>
            
            {/* Search Input */}
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={mode === 'gallery' ? 'Search artworks, artists...' : 'Search products, artists...'}
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
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm tracking-wide text-gray-400">RECENT SEARCHES</h2>
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

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm tracking-wide text-gray-400">TRENDING NOW</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(trend)}
                      className="px-4 py-2 bg-white rounded-full text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Filter Tabs */}
              <div className="flex items-center gap-3 mb-8 border-b border-gray-200">
                {[
                  { key: 'all', label: 'All Results' },
                  { key: 'artworks', label: mode === 'gallery' ? 'Artworks' : 'Products' },
                  { key: 'artists', label: 'Artists' },
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                    className={`px-4 py-3 text-sm border-b-2 transition-colors ${
                      activeFilter === filter.key
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-400 hover:text-black'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Search Results */}
              <div className="space-y-12">
                {/* Artists Section */}
                {(activeFilter === 'all' || activeFilter === 'artists') && (
                  <div>
                    <h2 className="text-2xl tracking-tight mb-6">Artists</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockArtists.map((artist) => (
                        <Link
                          key={artist.id}
                          to={`/artist/${artist.id}`}
                          className="group"
                        >
                          <div className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 mx-auto" />
                            <h3 className="text-lg mb-1 text-center group-hover:underline">
                              {artist.name}
                            </h3>
                            <p className="text-sm text-gray-400 text-center">
                              {artist.specialty}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artworks/Products Section */}
                {(activeFilter === 'all' || activeFilter === 'artworks') && (
                  <div>
                    <h2 className="text-2xl tracking-tight mb-6">
                      {mode === 'gallery' ? 'Artworks' : 'Products'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {(mode === 'gallery' ? mockArtworks : mockProducts).map((item) => (
                        <Link
                          key={item.id}
                          to={`/product/${item.id}`}
                          className="group"
                        >
                          <div className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                            <div className="aspect-square bg-gray-200" />
                            <div className="p-4">
                              <h3 className="text-sm mb-1 group-hover:underline">
                                {'title' in item ? item.title : item.name}
                              </h3>
                              <p className="text-xs text-gray-400 mb-2">
                                {item.artist}
                              </p>
                              <p className="text-sm">
                                ₩{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchQuery.length > 2 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <SearchIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 mb-2">
                      {activeFilter === 'all' 
                        ? `Showing results for "${searchQuery}"`
                        : `Showing ${activeFilter} results for "${searchQuery}"`
                      }
                    </p>
                    <p className="text-sm text-gray-400">
                      Try different keywords or browse our collections
                    </p>
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
