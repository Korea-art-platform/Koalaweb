import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function OrderConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/checkout', { replace: true });
  }, [navigate]);

  return null;
}
