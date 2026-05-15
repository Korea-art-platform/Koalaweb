import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAdminMe, adminLogout, type AdminMe } from '@/api/adminApi';

interface AdminAuthContextType {
  admin: AdminMe | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminMe | null>(null);
  const [loading, setLoading] = useState(true);

  // 마운트 시 HttpOnly 쿠키로 로그인 상태 확인
  useEffect(() => {
    getAdminMe()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  // 로그인: 서버가 이미 HttpOnly 쿠키를 설정했으므로 /me만 호출
  const login = async () => {
    const me = await getAdminMe();
    setAdmin(me);
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch {
      // 서버 오류여도 클라이언트 상태 초기화
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
