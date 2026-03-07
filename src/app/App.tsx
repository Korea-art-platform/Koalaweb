import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes.tsx';
import { ViewModeProvider } from './context/ViewModeContext';

function App() {
  return (
    <BrowserRouter>
      <ViewModeProvider>
        <AppRoutes />
      </ViewModeProvider>
    </BrowserRouter>
  );
}

export default App;