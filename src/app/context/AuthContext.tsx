import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { getMyProfile } from '@/api/user';
import { markSessionActive } from '@/api/instance';

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

  const setAuthenticated = (value: boolean) => {
    // 로그인에 성공했으면 토큰 재발급을 다시 시도할 수 있게 되돌린다.
    // (비로그인으로 확인된 뒤에는 인터셉터가 재발급을 건너뛴다)
    if (value) markSessionActive();
    setIsAuthenticated(value);
  };

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
