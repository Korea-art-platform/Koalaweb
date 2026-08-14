import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface Props {
  onReset?: () => void;
}

export default function ServerError({ onReset }: Props) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-koala-navy flex flex-col overflow-hidden relative">
      <div
        className="absolute top-[-120px] right-[-80px] w-[340px] h-[340px] rounded-full border border-red-900/20"
        style={{ transition: 'opacity 1.2s ease', opacity: visible ? 1 : 0 }}
      />
      <div
        className="absolute top-[-60px] right-[-40px] w-[200px] h-[200px] rounded-full border border-red-900/15"
        style={{ transition: 'opacity 1.4s ease', opacity: visible ? 1 : 0 }}
      />
      <div
        className="absolute bottom-[160px] left-[-100px] w-[280px] h-[280px] rounded-full border border-white/5"
        style={{ transition: 'opacity 1.6s ease', opacity: visible ? 1 : 0 }}
      />
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
      <div className="flex-1 flex flex-col justify-center px-8 pb-8 max-w-2xl mx-auto w-full">
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
            500
          </p>
        </div>
        <div
          className="mt-[-16px] space-y-3"
          style={{
            transition: 'opacity 1s ease, transform 1s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <h1 className="text-white text-3xl font-bold tracking-tight leading-snug">
            일시적인 오류가<br />발생했습니다
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            서버에 문제가 생겼어요.<br />
            잠시 후 다시 시도하거나 페이지를 새로고침해 주세요.
          </p>
        </div>
        <div
          className="my-8 h-px bg-white/10"
          style={{ transition: 'opacity 1.1s ease', opacity: visible ? 1 : 0 }}
        />
        <div
          className="flex gap-3"
          style={{
            transition: 'opacity 1.2s ease, transform 1.2s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-white text-black rounded-xl font-semibold text-sm tracking-tight flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            새로고침
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-white/8 text-white rounded-xl font-medium text-sm tracking-tight flex items-center justify-center gap-2 hover:bg-white/12 transition-colors border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로
          </button>
        </div>
      </div>
      <div
        className="px-8 pb-10 flex items-center gap-2"
        style={{ transition: 'opacity 1.4s ease', opacity: visible ? 0.3 : 0 }}
      >
        <div className="w-6 h-px bg-white/40" />
        <span className="text-white/60 text-[10px] tracking-[0.15em] uppercase font-medium">
          Internal server error
        </span>
      </div>
    </div>
  );
}
