import Navigation from '../components/Navigation';
import { useState } from 'react';
import { RotateCcw, Move, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function ARView() {
  const [mode, setMode] = useState<'360' | 'ar'>('360');

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 h-screen flex flex-col">
        {/* AR Viewer Area */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-white">
          {/* Preview Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-2xl aspect-square">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="3D Model Preview"
                className="w-full h-full object-contain"
              />
              
              {/* Rotation Indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
              <button
                onClick={() => setMode('360')}
                className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                  mode === '360' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                360° Viewer
              </button>
              <button
                onClick={() => setMode('ar')}
                className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                  mode === 'ar' ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                AR Placement
              </button>
            </div>
          </div>

          {/* Controls - Left */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
            <div className="flex flex-col gap-3 p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg">
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors" title="Rotate">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors" title="Move">
                <Move className="w-5 h-5" />
              </button>
              <div className="w-full h-px bg-gray-200" />
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors" title="Zoom In">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors" title="Zoom Out">
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Info Panel - Right */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10">
            <div className="w-80 p-6 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg space-y-4">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                  Premium Art Toy
                </div>
                <h3 className="text-xl mb-2">
                  Harmony Spirit
                </h3>
                <p className="text-sm text-gray-500">by Park Ji-young</p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Dimensions</span>
                  <span>15cm × 8cm × 8cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Material</span>
                  <span>Resin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Edition</span>
                  <span>125/500</span>
                </div>
              </div>

              <button className="w-full px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm">
                Add to Cart • $450
              </button>
            </div>
          </div>

          {/* Fullscreen Button */}
          <button className="absolute bottom-8 right-8 z-10 p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Instructions */}
          {mode === 'ar' && (
            <div className="absolute bottom-8 left-8 z-10 max-w-md p-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="text-sm space-y-2">
                <div className="font-medium">AR Placement Mode</div>
                <div className="text-gray-600">
                  Point your device at a flat surface to preview how this artwork will look in your space.
                </div>
              </div>
            </div>
          )}

          {mode === '360' && (
            <div className="absolute bottom-8 left-8 z-10 max-w-md p-4 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg">
              <div className="text-sm space-y-2">
                <div className="font-medium">360° Viewer</div>
                <div className="text-gray-600">
                  Drag to rotate • Scroll to zoom • Click to reset
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
