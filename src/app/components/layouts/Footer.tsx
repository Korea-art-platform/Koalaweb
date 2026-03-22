import { Link } from 'react-router';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-16">
        
        {/* 상단 섹션: 그리드 레이아웃 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 mb-12">
          
          {/* Brand Section: 모바일에서는 중앙 정렬도 고려하지만, 여기선 세련되게 왼쪽 정렬 유지 */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl font-bold tracking-tight text-white">KoALa</div>
              <div className="text-[10px] text-white/50 tracking-[0.2em] uppercase pt-1">
                Korean Art Lab
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-sm break-keep">
              한국 현대미술의 선구자들이 펼치는 창조적 여정과 영감을 경험하세요. 작품 갤러리, 작가의 연구소, 스마트 스토어, AR 뷰어 등 다양한 콘텐츠로 한국 미술의 매력을 소개합니다.
            </p>
            
            {/* 소셜 아이콘: 배경색을 어두운 톤에 맞춰 조정 */}
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

          {/* Links Sections: 모바일에서는 2열로 배치될 수 있게 sm:grid-cols-2 적용 */}
          <div className="grid grid-cols-2 col-span-1 sm:col-span-2 lg:col-span-3 gap-8 md:gap-12 lg:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">Explore</h3>
              <ul className="space-y-3">
                {[
                  { name: 'The Gallery', path: '/' },
                  { name: 'Artist Lab', path: '/artist-lab' },
                  { name: 'Smart Store', path: '/store' },
                  { name: 'AR View', path: '/ar-view' },
                  { name: 'Resell Market', path: '/resell' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">Support</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', path: '/help' },
                  { name: 'Shipping Info', path: '/shipping' },
                  { name: 'Returns', path: '/returns' },
                  { name: 'Contact Us', path: '/contact' },
                  { name: 'FAQ', path: '/faq' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-5 text-white uppercase">Company</h3>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Careers', path: '/careers' },
                  { name: 'Press', path: '/press' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Partnerships', path: '/partnerships' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-gray-500 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 정보 섹션 */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] md:text-xs text-gray-500 order-2 md:order-1">
              © 2026 KoALa. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 order-1 md:order-2">
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Cookie Policy', path: '/cookies' }
              ].map((link) => (
                <Link key={link.name} to={link.path} className="text-[10px] md:text-xs text-gray-500 hover:text-white transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}