import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';
import { STATUS_INFO, STEPS } from './constants';

export function OrderStatusStepper({ status }: { status: string }) {
  const { t } = useTranslation();

  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 px-6 py-5 bg-gray-50 rounded-2xl">
        <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <span className="text-sm font-bold text-gray-500">{t('order.detail.cancelledMessage')}</span>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(status as any);

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className="flex items-center w-full">
              {idx > 0 && (
                <div className={`flex-1 h-0.5 ${done || active ? 'bg-black' : 'bg-gray-200'}`} />
              )}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                active ? 'border-black bg-black' : done ? 'border-black bg-black' : 'border-gray-200 bg-white'
              }`}>
                {done || active ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                )}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ${done ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
            <span className={`text-[10px] mt-2 font-bold text-center leading-tight ${
              active ? 'text-black' : done ? 'text-gray-500' : 'text-gray-300'
            }`}>
              {t(`order.status.${step}`)}
            </span>
          </div>
        );
      })}
    </div>
  );
}