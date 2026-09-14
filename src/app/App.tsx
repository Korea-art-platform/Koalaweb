import '../locales/i18n';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { attachCartSync } from '@/app/hooks/useCart';
import { HelmetProvider } from 'react-helmet-async';
import { AppRoutes } from './routes.tsx';
import { ViewModeProvider } from './context/ViewModeContext';
import { AuthProvider } from './context/AuthContext';
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

attachCartSync(queryClient);

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
              <AppRoutes />
            </ViewModeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
