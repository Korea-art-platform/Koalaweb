import { useTranslation } from 'react-i18next';
import { STATUS_INFO } from './constants';

export function OrderSummaryHeader({ order }: { order: any }) {
  const { t } = useTranslation();
  const statusInfo = order ? (STATUS_INFO[order.orderStatus] ?? STATUS_INFO['PAID']) : null;

  return (
    <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-y-3">
      <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar">
        <div className="shrink-0">
          <p className="text-[9px] text-gray-400 uppercase mb-0.5 font-bold">{t('order.detail.orderNo')}</p>
          <p className="text-sm font-black text-gray-900">{order.orderNo}</p>
        </div>
        <div className="shrink-0">
          <p className="text-[9px] text-gray-400 uppercase mb-0.5 font-bold">{t('order.detail.orderDate')}</p>
          <p className="text-sm font-bold text-gray-700">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="shrink-0">
          <p className="text-[9px] text-gray-400 uppercase mb-0.5 font-bold">{t('order.detail.totalAmount')}</p>
          <p className="text-sm font-black text-black">
            ₩{Number(order.totalAmount).toLocaleString()}
          </p>
        </div>
      </div>
      {statusInfo && (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ${statusInfo.color}`}>
          {statusInfo.icon}
          {t(`order.status.${order.orderStatus}`)}
        </span>
      )}
    </div>
  );
}