import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-hidden relative">

      {/* 배경 — 추상적인 원형 오브제 */}
      <div
        className="absolute top-[-120px] right-[-80px] w-[340px] h-[340px] rounded-full border border-white/5"
        style={{ transition: 'opacity 1.2s ease', opacity: visible ? 1 : 0 }}
      />
      <div
        className="absolute top-[-60px] right-[-40px] w-[200px] h-[200px] rounded-full border border-white/8"
        style={{ transition: 'opacity 1.4s ease', opacity: visible ? 1 : 0 }}
      />
      <div
        className="absolute bottom-[160px] left-[-100px] w-[280px] h-[280px] rounded-full border border-white/5"
        style={{ transition: 'opacity 1.6s ease', opacity: visible ? 1 : 0 }}
      />
      <div
        className="absolute bottom-[200px] left-[-40px] w-[140px] h-[140px] rounded-full bg-white/[0.02]"
        style={{ transition: 'opacity 1.8s ease', opacity: visible ? 1 : 0 }}
      />

      {/* 상단 로고 */}
      <div
        className="px-8 pt-12"
        style={{
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-12px)',
        }}
      >
        <span className="text-white/40 text-xs font-medium tracking-[0.2em] uppercase">
          KOALA
        </span>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-center px-8 pb-8 max-w-2xl mx-auto w-full">

        {/* 404 대형 텍스트 */}
        <div
          style={{
            transition: 'opacity 0.9s ease, transform 0.9s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          <p
            className="text-white/10 font-black leading-none select-none"
            style={{ fontSize: 'clamp(100px, 20vw, 200px)', letterSpacing: '-0.04em' }}
          >
            404
          </p>
        </div>

        {/* 메시지 */}
        <div
          className="mt-[-16px] space-y-3"
          style={{
            transition: 'opacity 1s ease, transform 1s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <h1 className="text-white text-3xl font-bold tracking-tight leading-snug">
            이 작품은<br />전시되어 있지 않습니다
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            찾으시는 페이지가 사라졌거나,<br />
            아직 큐레이션 중일 수 있어요.
          </p>
        </div>

        {/* 구분선 */}
        <div
          className="my-8 h-px bg-white/10"
          style={{ transition: 'opacity 1.1s ease', opacity: visible ? 1 : 0 }}
        />

        {/* 버튼 그룹 */}
        <div
          className="flex gap-3"
          style={{
            transition: 'opacity 1.2s ease, transform 1.2s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-white text-black rounded-xl font-semibold text-sm tracking-tight flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </button>
          <button
            onClick={() => navigate('/smart-store')}
            className="flex-1 py-3 bg-white/8 text-white rounded-xl font-medium text-sm tracking-tight flex items-center justify-center gap-2 hover:bg-white/12 transition-colors border border-white/10"
          >
            <Search className="w-4 h-4" />
            작품 둘러보기
          </button>
        </div>
      </div>

      {/* 하단 갤러리 태그 */}
      <div
        className="px-8 pb-10 flex items-center gap-2"
        style={{ transition: 'opacity 1.4s ease', opacity: visible ? 0.3 : 0 }}
      >
        <div className="w-6 h-px bg-white/40" />
        <span className="text-white/60 text-[10px] tracking-[0.15em] uppercase font-medium">
          Gallery not found
        </span>
      </div>

    </div>
  );
}
