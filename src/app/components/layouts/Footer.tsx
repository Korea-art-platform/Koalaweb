import { Link } from 'react-router';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black order-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl tracking-tight text-white">KoALa</div>
              <div className="text-xs text-white tracking-wide">
                Korean Art Lab
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-md">
              한국 현대미술의 선구자들이 펼치는 창조적 여정과 영감을 경험하세요. 작품 갤러리, 작가의 연구소, 스마트 스토어, AR 뷰어 등 다양한 콘텐츠로 한국 미술의 매력을 소개합니다.
            </p>
            
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm tracking-wider mb-4 text-white">EXPLORE</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">
                  The Gallery
                </Link>
              </li>
              <li>
                <Link to="/artist-lab" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Artist Lab
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Smart Store
                </Link>
              </li>
              <li>
                <Link to="/ar-view" className="text-sm text-gray-500 hover:text-black transition-colors">
                  AR View
                </Link>
              </li>
              <li>
                <Link to="/resell" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Resell Market
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm tracking-wider mb-4 text-white">SUPPORT</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-500 hover:text-black transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm tracking-wider mb-4 text-white">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-500 hover:text-black transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="text-sm text-gray-500 hover:text-black transition-colors">
                  Partnerships
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400">
              © 2026 KoALa. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-xs text-gray-400 hover:text-black transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-gray-400 hover:text-black transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-xs text-gray-400 hover:text-black transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
