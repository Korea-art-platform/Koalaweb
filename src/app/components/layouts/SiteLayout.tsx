import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import Header from '@/app/components/layouts/Header';
import Footer from '@/app/components/layouts/Footer';
import QuickMenu from '@/app/components/common/QuickMenu';
import PopupLayer from '@/app/components/common/PopupLayer';

export default function SiteLayout() {
  const { i18n } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col bg-background">
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
