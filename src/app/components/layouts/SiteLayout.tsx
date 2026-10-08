import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from '@/app/components/layouts/Header';
import Footer from '@/app/components/layouts/Footer';
import QuickMenu from '@/app/components/common/QuickMenu';
import PopupLayer from '@/app/components/common/PopupLayer';

export default function SiteLayout() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const canonical = `https://koala-art.co.kr${pathname === '/' ? '' : pathname.replace(/\/+$/, '')}`;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Helmet>
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
      </Helmet>
      <Header />
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Outlet key={i18n.language} />
        </Suspense>
      </main>
      <Footer />
      <QuickMenu />
      <PopupLayer />
    </div>
  );
}
