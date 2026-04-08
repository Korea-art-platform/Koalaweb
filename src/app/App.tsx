import '../locales/i18n'; 
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes.tsx';
import { ViewModeProvider } from './context/ViewModeContext';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ViewModeProvider>
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
          <Header />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </ViewModeProvider>
    </BrowserRouter>
  );
}

export default App;