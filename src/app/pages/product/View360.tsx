import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, RotateCw, ZoomIn, ZoomOut, Maximize2, X, Info, ShoppingCart } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { getSku } from '@/api/sku';
import { addCartItem } from '@/api/cart';

export default function Product360View() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sku, setSku] = useState<any>(null);
  const [images360, setImages360] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // SKU 데이터 로드
  useEffect(() => {
    const fetchSku = async () => {
      setLoading(true);
      try {
        const res = await getSku(id!);
        const data = res.data.data;
        setSku(data);

        // spine_pictures_json 에서 360 이미지 추출
        // spine_pictures_json 형태: ["url1", "url2", ...]
        if (data.spinePicturesJson && data.spinePicturesJson.length > 0) {
          setImages360(data.spinePicturesJson);
        } else if (data.mediaList && data.mediaList.length > 0) {
          // spine_pictures_json 없으면 mediaList 이미지로 대체
          setImages360(
            data.mediaList
              .filter((m: any) => m.mediaType === 'IMAGE')
              .map((m: any) => m.fileUrl)
          );
        } else if (data.primaryImageUrl) {
          // 이미지도 없으면 대표 이미지 1장으로
          setImages360([data.primaryImageUrl]);
        }
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSku();
  }, [id]);

  const totalFrames = images360.length;

  // 자동 회전
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotate && totalFrames > 1) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isAutoRotate, totalFrames]);

  // 마우스 드래그
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoRotate(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || totalFrames <= 1) return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 5) {
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

  const handleMouseUp = () => setIsDragging(false);

  // 터치 드래그
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoRotate(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || totalFrames <= 1) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 5) {
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

  const handleTouchEnd = () => setIsDragging(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    setCartLoading(true);
    try {
      await addCartItem(sku.skuCode, 1);
      window.dispatchEvent(new Event('cart-updated'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e: any) {
      alert(e.response?.data?.message || '장바구니 담기 실패');
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sku || images360.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="text-gray-400 mb-6">360° 이미지를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-white text-black rounded-full font-bold"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
          <div className="bg-white text-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px]">
            <ShoppingCart className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">장바구니에 담겼습니다.</p>
              <Link to="/cart" className="text-xs text-gray-400 underline hover:text-black transition-colors">
                장바구니로 이동하기
              </Link>
            </div>
            <button onClick={() => setShowToast(false)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div ref={containerRef} className="fixed inset-0 pt-20 bg-black">

        {/* 헤더 */}
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
                <h1 className="text-xl">{sku.name}</h1>
                <p className="text-sm text-white/60">by {sku.artistName}</p>
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

        {/* 360 뷰어 */}
        <div className="h-full flex items-center justify-center px-8 py-32">
          <div className="relative max-w-5xl w-full aspect-square">
            <div
              className={`relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
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
                src={images360[currentFrame]}
                alt={`${sku.name} - ${currentFrame + 1}/${totalFrames}`}
                className="w-full h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
              />

              {/* 드래그 안내 */}
              {!isDragging && currentFrame === 0 && totalFrames > 1 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-8 py-4 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm flex items-center gap-3">
                    <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                    드래그하여 회전 • 스크롤하여 확대/축소
                  </div>
                </div>
              )}

              {/* 이미지 1장일 때 안내 */}
              {totalFrames === 1 && (
                <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
                  <div className="px-6 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white/60 text-xs">
                    360° 이미지가 등록되지 않았습니다
                  </div>
                </div>
              )}

              {/* 프레임 카운터 */}
              {totalFrames > 1 && (
                <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                  {currentFrame + 1} / {totalFrames}
                </div>
              )}

              {/* 줌 레벨 */}
              {zoom !== 1 && (
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                  {Math.round(zoom * 100)}%
                </div>
              )}
            </div>

            {/* 프로그레스 바 */}
            {totalFrames > 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className="h-full bg-white transition-all duration-200"
                  style={{ width: `${((currentFrame + 1) / totalFrames) * 100}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 컨트롤 바 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              disabled={totalFrames <= 1}
              className={`p-3 rounded-full transition-colors disabled:opacity-30 ${isAutoRotate ? 'bg-white text-black' : 'hover:bg-white/20 text-white'
                }`}
              title="자동 회전"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-white/20" />

            <button
              onClick={handleZoomOut}
              className="p-3 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-3 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-white/20" />

            <button
              onClick={toggleFullscreen}
              className="p-3 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              {isFullscreen ? <X className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 정보 패널 */}
        {showInfo && (
          <div className="absolute top-32 right-8 w-80 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-white">
            <h3 className="text-lg mb-4">상품 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">카테고리</span>
                <span>{sku.genre}</span>
              </div>
              {sku.widthCm && (
                <div className="flex justify-between">
                  <span className="text-white/60">크기</span>
                  <span>
                    {sku.widthCm}×{sku.heightCm}
                    {sku.depthCm ? `×${sku.depthCm}` : ''}cm
                  </span>
                </div>
              )}
              {sku.weightKg && (
                <div className="flex justify-between">
                  <span className="text-white/60">무게</span>
                  <span>{sku.weightKg}kg</span>
                </div>
              )}
              {sku.isLimitedEdition && (
                <div className="flex justify-between">
                  <span className="text-white/60">에디션</span>
                  <span>{sku.editionNumber} / {sku.editionSize}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/20">
                <span className="text-white/60 text-xs">가격</span>
                <p className="text-2xl mt-1 font-bold">
                  ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
                </p>
                {sku.salePrice && sku.salePrice < sku.listPrice && (
                  <p className="text-sm text-white/40 line-through">
                    ₩{sku.listPrice.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Link
                to={`/product/${id}`}
                className="flex-1 py-3 bg-white/10 text-white text-center rounded-xl hover:bg-white/20 transition-colors text-sm font-bold"
              >
                상세 보기
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
                className="flex-1 py-3 bg-white text-black text-center rounded-xl hover:bg-white/90 transition-colors text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {sku.status === 'OUT_OF_STOCK' ? '품절' : cartLoading ? '담는 중...' : '담기'}
              </button>
            </div>
          </div>
        )}

        {/* 모바일 하단 바 */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 bg-black/90 backdrop-blur-lg border-t border-white/10 z-20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-white/40 font-bold uppercase">Price</span>
              <p className="text-lg font-black text-white">
                ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
              className="flex-1 py-4 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50"
            >
              {sku.status === 'OUT_OF_STOCK' ? '품절' : '장바구니 담기'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
