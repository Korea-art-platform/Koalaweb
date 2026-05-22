import { useState, useRef, useEffect } from 'react';
import { Share2, Link2, Check } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

export function ShareButton({ title, description, imageUrl, url }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const shareUrl = url ?? window.location.href;

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const shareKakao = () => {
    if (!window.Kakao?.isInitialized()) return;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description: description ?? 'KOALA — Korean Art Lab',
        imageUrl: imageUrl ?? `${window.location.origin}/og-image.png`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [
        {
          title: '작품 보기',
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
      ],
    });
    setOpen(false);
  };

  const shareX = () => {
    const text = encodeURIComponent(`${title} — KOALA`);
    const encodedUrl = encodeURIComponent(shareUrl);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank');
    setOpen(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setOpen(false);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:border-black hover:text-black transition-all"
      >
        <Share2 className="w-4 h-4" />
        공유
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20">
          {/* 카카오톡 */}
          <button
            onClick={shareKakao}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm"
          >
            <div className="w-5 h-5 rounded bg-[#FEE500] flex items-center justify-center flex-shrink-0">
              <span className="text-[#3C1E1E] text-[9px] font-black">K</span>
            </div>
            카카오톡
          </button>

          {/* X(Twitter) */}
          <button
            onClick={shareX}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm border-t border-gray-50"
          >
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[9px] font-black">X</span>
            </div>
            X (Twitter)
          </button>

          {/* 링크 복사 */}
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm border-t border-gray-50"
          >
            <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            링크 복사
          </button>
        </div>
      )}

      {/* 복사 완료 토스트 */}
      {copied && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-5 py-2.5 rounded-full z-50 pointer-events-none shadow-lg">
          링크가 복사됐습니다 ✓
        </div>
      )}
    </div>
  );
}