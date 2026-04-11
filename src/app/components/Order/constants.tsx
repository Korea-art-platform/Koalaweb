import React from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

export const STATUS_INFO: Record<string, { color: string; icon: React.ReactNode }> = {
  PENDING_PAYMENT: {
    color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    icon: <Clock className="w-5 h-5 text-yellow-500" />,
  },
  PAID: {
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
  },
  PREPARING: {
    color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    icon: <Package className="w-5 h-5 text-yellow-500" />,
  },
  SHIPPED: {
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: <Truck className="w-5 h-5 text-blue-500" />,
  },
  DELIVERED: {
    color: 'bg-green-50 text-green-600 border-green-100',
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  CANCELLED: {
    color: 'bg-gray-50 text-gray-500 border-gray-100',
    icon: <XCircle className="w-5 h-5 text-gray-400" />,
  },
};

export const STEPS = ['PENDING_PAYMENT', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'] as const;