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

  useEffect(() => {
    getAdminMe()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async () => {
    const me = await getAdminMe();
    setAdmin(me);
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch {
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
