import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getMyProfile } from '@/api/user';

interface AuthContextValue {
  /** null = 초기 로딩 중, true = 로그인됨, false = 비로그인 */
  isAuthenticated: boolean | null;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // 앱 초기 로드 시 HttpOnly 쿠키로 인증 여부 확인
    getMyProfile()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  useEffect(() => {
    // 세션 만료 시 인터셉터가 발행하는 이벤트 수신 → 비인증 상태로 전환
    // ProtectedRoute가 /login으로 리다이렉트 (window.location 리로드 없이)
    const handleExpired = () => setIsAuthenticated(false);
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const setAuthenticated = (value: boolean) => setIsAuthenticated(value);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
