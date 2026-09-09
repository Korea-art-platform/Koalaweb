import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/** 바닥 로고에 쓰는 글자들. 한 자씩 따로 올라온다. */
const WORDMARK = 'KOREA-ART-LAB'.split('');

export default function Footer() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  /**
   * 바닥 로고가 아래에서 한 자씩 올라온다.
   *
   * 감시 대상은 글자가 아니라 줄 전체다. 글자는 처음에 자기 창 아래로 내려가
   * 있어서, 글자를 직접 감시하면 화면에 들어온 적이 없다고 판정되어 영원히
   * 안 켜진다.
   *
   * 변형 전파(variants)에 기대지 않고 useInView 로 직접 켠다. 중간에 창 역할을
   * 하는 평범한 span 이 끼어 있어 전파가 닿지 않았다.
   *
   * 모션을 줄이도록 설정한 사용자에게는 처음부터 제자리에 둔다.
   */
  const markRef = useRef<HTMLDivElement>(null);
  const inView = useInView(markRef, { once: true, amount: 0.35 });

  // 안전장치. 화면 진입 감지가 어떤 이유로든 안 되면 글자가 창 아래에 숨은 채
  // 영영 안 올라온다 — 로고가 통째로 사라지는 셈이다. 몇 초 뒤에는 무조건
  // 보이게 둔다. 정상이면 이미 올라온 뒤라 눈에 띄는 차이가 없다.
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setFallback(true), 4000);
    return () => window.clearTimeout(id);
  }, []);
  const shown = inView || fallback;

  const piece = (index: number) =>
    reduce
      ? {}
      : {
          initial: { y: '115%' },
          animate: shown ? { y: '0%' } : { y: '115%' },
          transition: {
            duration: 0.62,
            delay: 0.1 + index * 0.055,
            ease: [0.22, 0.61, 0.36, 1] as const,
          },
        };

  return (
    <footer className="relative">
      {/* 지평선.
          윗변을 직선으로 두면 본문과 푸터가 뚝 끊긴다. 아주 얕은 호로 두어
          작품 섹션이 끝나고 내려앉는 것처럼 만든다. 파도가 아니라 지평선이라
          가운데가 겨우 몇십 px 솟는 정도다.

          호는 푸터 박스 위에 있어야 하므로 overflow-hidden 을 안쪽 상자로
          옮겼다. 바깥에 두면 호와 서표가 잘린다. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 44"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-full block h-6 w-full md:h-11"
      >
        <path
          d="M0,44 L0,34 C300,10 560,2 720,2 C880,2 1140,10 1440,34 L1440,44 Z"
          fill="#140b20"
        />
      </svg>

      {/* 서표.
          작품 카드에 쓰는 것과 같은 모티프다. 페이지가 여기서 끝난다는 표시로
          모서리에 걸어 둔다. 로고와 겹치지 않게 오른쪽에 둔다. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 right-[8%] z-10 hidden md:block
          drop-shadow-[0_8px_16px_rgba(20,11,32,0.42)] [transform:rotate(-7deg)] [transform-origin:50%_7%]"
      >
        <svg width="52" height="118" viewBox="0 0 46 104" style={{ overflow: 'visible' }}>
          <circle cx="23" cy="8" r="5" fill="none" stroke="#c9a45c" strokeWidth="2.2" />
          <line x1="23" y1="13" x2="23" y2="17" stroke="#c9a45c" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="8" y="17" width="30" height="80" rx="5" fill="#3e2259" stroke="#c9a45c" strokeWidth="2.2" />
          <rect x="11.5" y="20.5" width="23" height="73" rx="3" fill="none" stroke="#e6cf98" strokeWidth="0.9" opacity="0.95" />
          <g stroke="#dcbc7c" strokeWidth="0.65" opacity="0.6">
            <path d="M11.5 32 H34.5 M11.5 82 H34.5" />
            <path d="M17 22 V41 M23 22 V41 M29 22 V41" />
            <path d="M17 73 V92 M23 73 V92 M29 73 V92" />
          </g>
          <g stroke="#e6cf98" strokeWidth="1">
            <path d="M12.5 25.5 H33.5 M12.5 27.2 H33.5" />
            <path d="M12.5 86.5 H33.5 M12.5 88.2 H33.5" />
          </g>
          <g fill="#ead9ad">
            <circle cx="15" cy="28" r="2.1" />
            <circle cx="31" cy="33" r="2.1" />
            <circle cx="16" cy="86" r="2.1" />
          </g>
          <circle cx="23" cy="57" r="14" fill="#e6cf98" stroke="#c9a45c" strokeWidth="1.4" />
          <circle cx="23" cy="57" r="7" fill="#3e2259" />
        </svg>
      </span>

      <div className="relative overflow-hidden bg-[#140b20]">
        {/* 아래쪽 글로우. 금색이 아니라 퍼플이다 — 금색은 원작 표시에만 쓴다
            (DESIGN.md). 전에는 여기에 금색 방사가 두 겹 깔려 있었다. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[380px]"
          style={{
            background:
              'radial-gradient(140% 110% at 50% 106%, rgba(90,53,128,0.55) 0%, rgba(62,34,89,0.26) 38%, transparent 72%)',
          }}
        />
        <div className="relative max-w-[1600px] mx-auto px-6 md:px-8 pt-12 md:pt-16 pb-24 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 mb-10">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <img src="/logo-symbol-white.svg" alt="" aria-hidden className="h-11 w-11" />
              <span className="text-[17px] font-semibold uppercase tracking-[0.18em] text-white">
                Korea-Art-Lab
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm break-keep">
              {t('footer.brand.description')}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/koalaobjects/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="KOALA Instagram"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-white/5 text-white/75 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:bg-white/15 hover:text-white hover:border-white/30 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 col-span-1 sm:col-span-2 lg:col-span-3 gap-8 md:gap-12">
            <div>
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">{t('footer.explore.title')}</h3>
              <ul className="space-y-3">
                {[
                  { key: 'artistLab', path: '/artist-lab' },
                  { key: 'store', path: '/store' },
                  { key: 'stores', path: '/stores' },
                  { key: 'about', path: '/about' }
                ].map((link) => (
                  <li key={link.key}>
                    <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {t(`footer.explore.links.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">{t('footer.support.title')}</h3>
              <ul className="space-y-3">
                {[
                  { key: 'help', path: '/help' },
                  // 비회원은 로그인이 없어 여기 말고는 자기 주문을 찾을 길이 없다.
                  { key: 'orderLookup', path: '/order-lookup', label: '주문 조회' },
                  { key: 'shipping', path: '/shipping' },
                  { key: 'returns', path: '/returns' },
                  { key: 'contact', path: '/contact' },
                  { key: 'notice', path: '/notice'},
                  { key: 'faq', path: '/faq' }
                ].map((link) => (
                  <li key={link.key}>
                    <Link to={link.path} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {(link as { label?: string }).label ?? t(`footer.support.links.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* 마감 로고.
            푸터 바닥에 마크와 글자를 한 줄로 크게 깐다. 페이지가 여기서
            끝난다는 표시고, 아래 사업자 정보와 시선을 다투지 않도록 흰색을
            눌러 뒀다. 글자 사이는 남는 폭에 맞춰 벌어진다. */}
        <div
          ref={markRef}
          aria-hidden
          className="mb-10 flex items-center gap-4 md:gap-6 border-t border-white/10 pt-10"
        >
          {/* 마크가 먼저 올라오고 글자가 뒤따른다. */}
          <span className="inline-block shrink-0 overflow-hidden">
            <motion.img
              src="/logo-symbol-white.svg"
              alt=""
              className="block opacity-80"
              style={{ width: 'clamp(2.75rem, 8.4vw, 7rem)', height: 'clamp(2.75rem, 8.4vw, 7rem)' }}
              {...piece(0)}
            />
          </span>
          <span
            className="min-w-0 flex-1 whitespace-nowrap text-[clamp(1.5rem,7.2vw,6rem)] font-bold uppercase
              leading-none text-white/70"
            style={{ letterSpacing: '0.02em' }}
          >
            <span className="inline-flex w-full justify-between">
              {WORDMARK.map((ch, i) => (
                // 글자마다 창을 하나씩 두고 그 안에서 올라오게 한다.
                // 창이 없으면 글자가 푸터 바깥에서부터 미끄러져 들어와 어색하다.
                <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <motion.span className="inline-block" {...piece(i + 1)}>
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          </span>
        </div>

        <div className="pt-10 border-t border-white/10 space-y-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 md:px-6 md:py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <p className="text-xs md:text-[13px] text-gray-400 leading-relaxed break-keep">
              상호명: 헤론 &nbsp;|&nbsp; 서비스명: KOALA-ART &nbsp;|&nbsp; 대표이사: 정동훈 &nbsp;|&nbsp; 사업자등록번호: 203-87-01972
              &nbsp;|&nbsp; 통신판매업 신고번호: 제2024-서울서초-3956호
              <br className="hidden sm:block" />
              &nbsp;|&nbsp; 주소: 서울특별시 서초구 서운로6길 26, 4층 4482호(지훈빌딩)
              &nbsp;|&nbsp; 고객센터: <a href="tel:18332817" className="text-gray-300 hover:text-white transition-colors">1833-2817</a>
              &nbsp;|&nbsp; 이메일: <a href="mailto:koala-art@heron.kr" className="text-gray-300 hover:text-white transition-colors">koala-art@heron.kr</a>
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 order-2 md:order-1">
              {t('footer.bottom.copyright')}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 order-1 md:order-2">
              {[
                { key: 'privacy', path: '/privacy' },
                { key: 'terms', path: '/terms' },
                { key: 'youthProtection', path: '/youth-protection' },
                { key: 'cookies', path: '/cookies' }
              ].map((link) => (
                <Link key={link.key} to={link.path} className="text-[10px] md:text-xs text-gray-400 hover:text-white transition-colors">
                  {t(`footer.bottom.${link.key}`)}
                </Link>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
