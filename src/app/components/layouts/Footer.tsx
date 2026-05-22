import { Link } from 'react-router';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-16">
        
        {/* 상단 섹션: 그리드 레이아웃 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="KOALA"
                className="h-12 w-auto"
                style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-sm break-keep">
              {t('footer.brand.description')}
            </p>
            
            {/* 소셜 아이콘 */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Youtube, href: "https://youtube.com" }
              ].map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 col-span-1 sm:col-span-2 lg:col-span-3 gap-8 md:gap-12 lg:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">{t('footer.explore.title')}</h3>
              <ul className="space-y-3">
                {[
                  { key: 'gallery', path: '/' },
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

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">{t('footer.company.title')}</h3>
              <ul className="space-y-3">
                {[
                  { key: 'about', path: '/about' },
                ].map((link) => (
                  <li key={link.key}>
                    <Link to={link.path} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {t(`footer.company.links.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          <p className="text-[10px] text-gray-600 leading-relaxed break-keep">
            상호명: (주)코알라 &nbsp;|&nbsp; 대표이사: 정동훈 &nbsp;|&nbsp; 사업자등록번호: 203-87-01972
            &nbsp;|&nbsp; 통신판매업 신고번호: 제2024-서울서초-3956호
            <br className="hidden sm:block" />
            &nbsp;|&nbsp; 주소: 서울특별시 강서구 마곡중앙6로 21, 이너매스마곡 제619호 &nbsp;|&nbsp; 이메일: koala-art@heron.kr
          </p>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-500 order-2 md:order-1">
              {t('footer.bottom.copyright')}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 order-1 md:order-2">
              {[
                { key: 'privacy', path: '/privacy' },
                { key: 'terms', path: '/terms' },
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