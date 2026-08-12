import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    /*
     * 끝까지 내리면 화면이 푸터로 가득 찬다.
     * 높이만 늘리면 아래가 텅 비므로 flex 로 위아래를 벌리고,
     * 남는 자리에 브랜드 워드마크를 크게 깐다.
     */
    <footer className="bg-koala-navy border-t border-white/10 min-h-screen min-h-[100dvh] flex flex-col overflow-hidden">
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-6 md:px-8 py-12 md:py-16 flex flex-col">

        {/* 상단 섹션: 그리드 레이아웃 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12">
          
          {/* Brand Section */}
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

            {/* 소셜 아이콘 — 실제 계정 개설 후 복원.
                도메인 루트(https://instagram.com)로 걸려 있어 미완성으로 보였다. */}
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 col-span-1 sm:col-span-2 lg:col-span-3 gap-8 md:gap-12">
            <div>
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">{t('footer.explore.title')}</h3>
              <ul className="space-y-3">
                {[
                  { key: 'artistLab', path: '/artist-lab' },
                  { key: 'store', path: '/store' }
                ].map((link) => (
                  <li key={link.key}>
                    <Link to={link.path} className="text-sm text-gray-500 hover:text-white transition-colors">
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
                  { key: 'shipping', path: '/shipping' },
                  { key: 'returns', path: '/returns' },
                  { key: 'contact', path: '/contact' },
                  { key: 'notice', path: '/notice'},
                  { key: 'faq', path: '/faq' }
                ].map((link) => (
                  <li key={link.key}>
                    <Link to={link.path} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {t(`footer.support.links.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 회사 소개 칼럼 제거 — /about 페이지를 내렸다. 페이지 복구 시 함께 되살릴 것 */}
          </div>
        </div>

        {/* 브랜드 워드마크 — 남는 세로 공간을 채운다.
            정보가 아니라 여백이므로 스크린리더에서 숨긴다. */}
        <div className="flex-1 min-h-[80px] flex items-center justify-center py-8" aria-hidden="true">
          <img
            src="/logo-white.svg"
            alt=""
            className="w-full max-w-[900px] opacity-[0.06] select-none pointer-events-none"
          />
        </div>

        {/* 사업자 정보 */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          <p className="text-[10px] text-gray-600 leading-relaxed break-keep">
            상호명: 헤론 &nbsp;|&nbsp; 서비스명: KOALA-ART &nbsp;|&nbsp; 대표이사: 정동훈 &nbsp;|&nbsp; 사업자등록번호: 203-87-01972
            &nbsp;|&nbsp; 통신판매업 신고번호: 제2024-서울서초-3956호
            <br className="hidden sm:block" />
            &nbsp;|&nbsp; 주소: 서울특별시 강서구 마곡중앙6로 21, 이너매스마곡 제619호
            &nbsp;|&nbsp; 고객센터: <a href="tel:18332817" className="hover:text-gray-400 transition-colors">1833-2817</a>
            &nbsp;|&nbsp; 이메일: koala-art@heron.kr
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-500 order-2 md:order-1">
              {t('footer.bottom.copyright')}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 order-1 md:order-2">
              {[
                { key: 'privacy', path: '/privacy' },
                { key: 'terms', path: '/terms' },
                { key: 'youthProtection', path: '/youth-protection' },
                { key: 'cookies', path: '/cookies' }
              ].map((link) => (
                <Link key={link.key} to={link.path} className="text-[10px] md:text-xs text-gray-500 hover:text-white transition-colors">
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