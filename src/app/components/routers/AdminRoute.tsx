import { Navigate, Outlet } from 'react-router';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import { AdminLayout } from '@/app/components/layouts/AdminLayout';

export default function AdminRoute(){
    const {token, loading} = useAdminAuth();
    if(loading){
        return(
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="text-sm text-gray-400">로딩 중...</div>
            </div>
        );
    }
    if (!token) return <Navigate to = "/admin/login" replace />;
    return (
        <AdminLayout>
            <Outlet/>
        </AdminLayout>
    );
}