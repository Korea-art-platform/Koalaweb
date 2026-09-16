import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { logout as logoutApi } from '@/api/auth';
import { useAuth } from '@/app/context/AuthContext';
import { notifyCartUpdated } from '@/app/hooks/useCart';

export function useLogout(): () => Promise<void> {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuthenticated } = useAuth();

  return useCallback(async () => {
    try {
      await logoutApi();
    } catch {
    } finally {
      setAuthenticated(false);
      queryClient.clear();
      notifyCartUpdated();
      navigate('/login');
    }
  }, [navigate, queryClient, setAuthenticated]);
}
