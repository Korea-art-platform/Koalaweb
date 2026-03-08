import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, RotateCw, ZoomIn, ZoomOut, Maximize2, X, Info } from 'lucide-react';
import Navigation from '../components/layouts/Header';

// Mock product data with multiple angle images
const productData = {
  id: '1',
  name: 'Harmony Spirit',
  artist: 'Park Ji-young',
  category: 'Premium Art Toy',
  price: 450,
  description: 'A limited edition art toy inspired by Korean guardian spirits.',
  // Simulated 360 view with multiple angles (in real app, you'd have actual 360° images)
  images360: [
    'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?w=800',
    'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?w=800',
    'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?w=800',
    'https://images.unsplash.com/photo-1706821856764-4e85de5482d3?w=800',
    'https://images.unsplash.com/photo-1760716478137-d861d5b354e8?w=800',
    'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?w=800',
    'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?w=800',
    'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?w=800',
  ],
  dimensions: '15cm × 8cm × 8cm',
  materials: 'Resin, Hand-painted',
  edition: '125/500',
};

export default function Product360View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalFrames = productData.images360.length;

  // Auto-rotate effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotate) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAutoRotate, totalFrames]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const sensitivity = 5;
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let next = prev + direction;
        if (next < 0) next = totalFrames - 1;
        if (next >= totalFrames) next = 0;
        return next;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoRotate(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 5;
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let next = prev + direction;
        if (next < 0) next = totalFrames - 1;
        if (next >= totalFrames) next = 0;
        return next;
      });
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div 
        ref={containerRef}
        className="fixed inset-0 pt-20 bg-black"
      >
        {/* Header */}
        <div className="absolute top-20 left-0 right-0 z-20 px-8 py-6 bg-gradient-to-b from-black/80 to-transparent">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-white">
                <h1 className="text-xl">{productData.name}</h1>
                <p className="text-sm text-white/60">by {productData.artist}</p>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              {showInfo ? 'Hide Info' : 'Show Info'}
            </button>
          </div>
        </div>

        {/* Main 360 Viewer */}
        <div className="h-full flex items-center justify-center px-8 py-32">
          <div className="relative max-w-5xl w-full aspect-square">
            {/* 360 Image Container */}
            <div
              className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={productData.images360[currentFrame]}
                alt={`${productData.name} - Frame ${currentFrame + 1}`}
                className="w-full h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
              />

              {/* Drag Instruction (shows initially) */}
              {!isDragging && currentFrame === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-8 py-4 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm flex items-center gap-3">
                    <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                    Drag to rotate • Scroll to zoom
                  </div>
                </div>
              )}

              {/* Frame Counter */}
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                {currentFrame + 1} / {totalFrames}
              </div>

              {/* Zoom Level */}
              {zoom !== 1 && (
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                  {Math.round(zoom * 100)}%
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${((currentFrame + 1) / totalFrames) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            {/* Auto Rotate */}
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`p-3 rounded-full transition-colors ${
                isAutoRotate
                  ? 'bg-white text-black'
                  : 'hover:bg-white/20 text-white'
              }`}
              title="Auto Rotate"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-white/20" />

            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-3 hover:bg-white/20 text-white rounded-full transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-3 hover:bg-white/20 text-white rounded-full transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-white/20" />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-3 hover:bg-white/20 text-white rounded-full transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <X className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <div className="absolute top-32 right-8 w-80 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-white">
            <h3 className="text-lg mb-4">Product Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Category</span>
                <span>{productData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Dimensions</span>
                <span>{productData.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Materials</span>
                <span>{productData.materials}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Edition</span>
                <span>{productData.edition}</span>
              </div>
              <div className="pt-3 border-t border-white/20">
                <span className="text-white/60 text-xs">Price</span>
                <p className="text-2xl mt-1">${productData.price}</p>
              </div>
            </div>
            <Link
              to={`/product/${id}`}
              className="block w-full mt-6 py-3 bg-white text-black text-center rounded-lg hover:bg-white/90 transition-colors"
            >
              View Full Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
