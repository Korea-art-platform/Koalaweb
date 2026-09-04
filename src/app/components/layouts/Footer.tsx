import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden bg-[#140b20]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[440px]"
        style={{
          background:
            'radial-gradient(165% 135% at 50% 100%, rgba(199,161,90,0.80) 0%, rgba(165,129,61,0.46) 22%, rgba(62,34,89,0.22) 48%, transparent 76%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px]"
        style={{
          background:
            'radial-gradient(105% 82% at 50% 106%, rgba(250,240,214,0.64) 0%, rgba(232,211,164,0.28) 34%, transparent 66%)',
        }}
      />
      <div className="relative max-w-[1600px] mx-auto px-6 md:px-8 pt-12 md:pt-16 pb-24 md:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 mb-10">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src="/logo-white.svg"
                alt="KOALA"
                className="h-12 w-auto"
              />
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
    </footer>
  );
}
