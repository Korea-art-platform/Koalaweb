import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // 초기 인증 확인 중 — 깜빡임 없이 대기
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
