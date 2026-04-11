import React from 'react';
import { MapPin, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function OrderInfoCards({ order }: { order: any }) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* 배송지 정보 */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-gray-900">{t('order.detail.shippingInfo')}</h3>
        </div>
        {order.shipment ? (
          <div className="space-y-1.5 text-sm">
            <p className="font-bold text-gray-900">
              {order.shipment.recipientName}
              <span className="font-normal text-gray-400 ml-2">{order.shipment.recipientPhone}</span>
            </p>
            <p className="text-gray-600">
              [{order.shipment.zipCode}] {order.shipment.address1}
            </p>
            {order.shipment.address2 && (
              <p className="text-gray-400">{order.shipment.address2}</p>
            )}
            {order.shipment.deliveryRequest && (
              <p className="text-xs text-gray-400 mt-1 bg-gray-50 rounded-lg px-3 py-2">
                {order.shipment.deliveryRequest}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">{t('order.detail.noShippingInfo')}</p>
        )}
      </div>

      {/* 결제 수단 */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-gray-900">{t('order.detail.paymentMethodTitle')}</h3>
        </div>
        <p className="text-sm font-bold text-gray-900">
          {order.paymentMethod ?? t('order.status.PAID')}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}