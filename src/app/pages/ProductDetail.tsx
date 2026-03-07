import Navigation from '../components/Navigation';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, ShoppingCart, Heart, Share2, Package, Shield, Globe, Box, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const productData = {
  id: '1',
  name: 'Harmony Spirit',
  artist: 'Park Ji-young',
  artistId: '3',
  category: 'Premium Art Toy',
  price: 450,
  description: 'A limited edition art toy inspired by Korean guardian spirits. Hand-crafted with premium materials and authenticated on blockchain.',
  images: [
    'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2xsZWN0aWJsZSUyMGZpZ3VyaW5lfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2N1bHB0dXJlJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
  ],
  hasNFT: true,
  has3D: true,
  edition: '125/500',
  materials: 'Resin, Hand-painted',
  dimensions: '15cm × 8cm × 8cm',
  originalArtwork: {
    title: 'Guardian Spirit Series',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1769524256027-d2dd0d7b7e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFydCUyMHBhaW50aW5nfGVufDF8fHx8MTc3MjM2MzQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    // In a real app, this would add to cart state/context
    navigate('/cart');
  };

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
                  src={productData.images[selectedImage]}
                  alt={productData.name}
                  className="w-full h-full object-cover"
                />
                
                {/* 3D Viewer Badge */}
                {productData.has3D && (
                  <Link
                    to={`/product/${id}/360`}
                    className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                  >
                    <Box className="w-4 h-4" />
                    <span className="text-sm">360° View</span>
                  </Link>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-xl bg-gray-50 aspect-square ${
                      selectedImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${productData.name} ${index + 1}`}
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
                  {productData.name}
                </h1>
                <Link
                  to={`/artist/${productData.artistId}`}
                  className="text-lg text-gray-500 hover:text-black transition-colors"
                >
                  by {productData.artist}
                </Link>
              </div>

              <div className="text-3xl">
                ${productData.price.toLocaleString()}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {productData.hasNFT && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">NFT Authenticated</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Global Shipping</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Edition {productData.edition}</span>
                </div>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                {productData.description}
              </p>

              {/* Specs */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Materials</span>
                  <span>{productData.materials}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dimensions</span>
                  <span>{productData.dimensions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Edition</span>
                  <span>{productData.edition}</span>
                </div>
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
                    <div className="text-gray-500">DHL Express • 3-5 business days • Fully insured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Original Artwork Section */}
          <div className="mt-32">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl mb-2">
                  View Original Artwork
                </h2>
                <p className="text-gray-500">
                  This art toy is inspired by an original painting
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[4/3]">
                  <ImageWithFallback
                    src={productData.originalArtwork.image}
                    alt={productData.originalArtwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-400 tracking-wide uppercase mb-2">
                      Original Artwork
                    </div>
                    <h3 className="text-3xl mb-3">
                      {productData.originalArtwork.title}
                    </h3>
                    <p className="text-gray-500 mb-4">by {productData.artist}</p>
                    <div className="text-2xl mb-6">
                      ${productData.originalArtwork.price.toLocaleString()}
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    Experience the original artwork that inspired this collectible. 
                    Hand-painted with traditional Korean techniques and contemporary vision.
                  </p>

                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                    View Full Artwork
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}