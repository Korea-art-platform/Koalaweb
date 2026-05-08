import '../locales/i18n';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes.tsx';
import { ViewModeProvider } from './context/ViewModeContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { useEffect } from 'react'; // 추가
import TagManager from 'react-gtm-module'; // 추가

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,   
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID as string;
    if (gtmId) TagManager.initialize({ gtmId });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <ViewModeProvider>
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
              <Header />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </ViewModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;