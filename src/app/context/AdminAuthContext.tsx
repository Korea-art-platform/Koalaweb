import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAdminMe, type AdminMe } from '@/api/adminApi';

interface AdminAuthContextType {
  admin: AdminMe | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminMe | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    getAdminMe()
      .then(setAdmin)
      .catch(() => {
        sessionStorage.removeItem('admin_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (newToken: string) => {
    sessionStorage.setItem('admin_token', newToken);
    setToken(newToken);
    const me = await getAdminMe();
    setAdmin(me);
  };

  const logout = () => {
    sessionStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}