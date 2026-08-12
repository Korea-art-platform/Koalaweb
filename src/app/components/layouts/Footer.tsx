import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-koala-navy border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12">
          
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

        {/* 사업자 정보 */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          {/* 전자상거래법 필수 표시사항 — 작아서 안 읽히면 표시한 의미가 없다 */}
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed break-keep">
            상호명: 헤론 &nbsp;|&nbsp; 서비스명: KOALA-ART &nbsp;|&nbsp; 대표이사: 정동훈 &nbsp;|&nbsp; 사업자등록번호: 203-87-01972
            &nbsp;|&nbsp; 통신판매업 신고번호: 제2024-서울서초-3956호
            <br className="hidden sm:block" />
            &nbsp;|&nbsp; 주소: 경기도 파주시 파주읍 통일로 1552번길 54
            &nbsp;|&nbsp; 고객센터: <a href="tel:18332817" className="hover:text-gray-400 transition-colors">1833-2817</a>
            &nbsp;|&nbsp; 이메일: koala-art@heron.kr
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 order-2 md:order-1">
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