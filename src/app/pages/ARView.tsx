import Navigation from '../components/layouts/Header';
import { useState } from 'react';
import { RotateCcw, Move, ZoomIn, ZoomOut, Maximize2, CheckCircle2, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router';

export default function ARView() {
  const [mode, setMode] = useState<'360' | 'ar'>('360');
  const [showToast, setShowToast] = useState(false);

  // --- 장바구니 담기 로직 ---
  const handleAddToCart = () => {
    // 1. 저장할 아이템 데이터 정의 (현재 화면의 작품 정보)
    const newItem = {
      id: "art-toy-001", // 고유 ID
      name: "하모니 스피릿 (Harmony Spirit)",
      artist: "박지영",
      price: 620000,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      size: "15cm × 8cm × 8cm"
    };

    // 2. localStorage 데이터 처리
    const savedCart = localStorage.getItem('cart');
    let cartList = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = cartList.findIndex((item: any) => item.id === newItem.id);
    if (existingItemIndex > -1) {
      cartList[existingItemIndex].quantity += 1;
    } else {
      cartList.push(newItem);
    }

    // 3. 저장 및 이벤트 발생 (헤더 숫자 업데이트)
    localStorage.setItem('cart', JSON.stringify(cartList));
    window.dispatchEvent(new Event('cart-updated'));

    // 4. 토스트 알림 표시
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navigation />

      {/* --- 장바구니 알림 Toast --- */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[340px]">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">장바구니에 담겼습니다.</p>
              <Link to="/cart" className="text-xs text-gray-400 underline hover:text-white transition-colors">
                장바구니로 이동하기
              </Link>
            </div>
            <button onClick={() => setShowToast(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <div className="pt-24 h-screen flex flex-col">
        {/* AR/3D 뷰어 영역 */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          
          {/* 중앙 프리뷰 이미지 */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="3D 모델 미리보기"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              
              {/* 회전 인디케이터 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[80%] border-2 border-dashed border-gray-200 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </div>
          </div>

          {/* 모드 토글 (상단 중앙) */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-xs px-4">
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-gray-100">
              <button
                onClick={() => setMode('360')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                  mode === '360' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
                }`}
              >
                360° 뷰어
              </button>
              <button
                onClick={() => setMode('ar')}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                  mode === 'ar' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
                }`}
              >
                AR 공간 배치
              </button>
            </div>
          </div>

          {/* 컨트롤 바 (왼쪽 세로) - 모바일에서는 하단으로 위치 조정 가능하지만 일단 유지 */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
            <div className="flex flex-col gap-4 p-3 rounded-[24px] bg-white/90 backdrop-blur-md shadow-xl border border-gray-100">
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title="회전"><RotateCcw className="w-5 h-5" /></button>
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title="이동"><Move className="w-5 h-5" /></button>
              <div className="w-full h-px bg-gray-100" />
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title="확대"><ZoomIn className="w-5 h-5" /></button>
              <button className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-700" title="축소"><ZoomOut className="w-5 h-5" /></button>
            </div>
          </div>

          {/* 정보 패널 (오른쪽 세로) */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
            <div className="w-80 p-8 rounded-[32px] bg-white/90 backdrop-blur-md shadow-2xl space-y-8 border border-gray-100">
              <div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold">Premium Art Toy</div>
                <h3 className="text-2xl font-medium mb-1 leading-tight">하모니 스피릿</h3>
                <p className="text-sm text-gray-500 font-medium">박지영 작가</p>
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dimensions</span>
                  <span className="font-bold text-gray-900">15cm × 8cm × 8cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Material</span>
                  <span className="font-bold text-gray-900">Resin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Edition</span>
                  <span className="font-bold text-gray-900">125 / 500</span>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full py-5 bg-black text-white rounded-2xl hover:bg-gray-800 transition-all font-bold active:scale-[0.98] shadow-lg shadow-black/10"
              >
                장바구니 담기 • ₩620,000
              </button>
            </div>
          </div>

          {/* 전체화면 버튼 (우측 하단) */}
          <button className="absolute bottom-8 right-8 z-10 p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white transition-all border border-gray-100">
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>

          {/* 안내 메시지 (좌측 하단) */}
          <div className="absolute bottom-8 left-8 z-10 max-w-[280px] sm:max-w-sm p-6 rounded-[24px] bg-white/90 backdrop-blur-md shadow-xl border border-gray-100">
            <div className="text-sm space-y-2">
              <div className="font-bold flex items-center gap-2 text-black">
                {mode === 'ar' ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    AR 공간 배치 모드
                  </>
                ) : (
                  "360° 뷰어 조작 안내"
                )}
              </div>
              <div className="text-gray-500 text-xs leading-relaxed">
                {mode === 'ar' 
                  ? "기기를 평평한 바닥이나 테이블에 비추어 작품이 공간에 실제 배치된 모습을 확인해 보세요."
                  : "드래그하여 회전 • 스크롤하여 확대/축소 • 더블 클릭하여 시점 초기화"}
              </div>
            </div>
          </div>

          {/* 모바일용 하단 결제 바 (LG 미만 화면에서 표시) */}
          <div className="lg:hidden absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
                <span className="text-lg font-black text-black">₩620,000</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-black text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
              >
                장바구니 담기
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}