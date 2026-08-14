import '../locales/i18n';
import { BrowserRouter, useLocation } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from './routes.tsx';
import { ViewModeProvider } from './context/ViewModeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {!isAdmin && <Header />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID as string;
    if (gtmId) TagManager.initialize({ gtmId });
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <ViewModeProvider>
              <Layout />
            </ViewModeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
