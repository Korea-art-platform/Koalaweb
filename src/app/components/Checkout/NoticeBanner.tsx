import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
export function NoticeBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 font-medium mb-1">
            {t('order.confirmation.notice.title')}
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">
            {t('order.confirmation.notice.description')}
          </p>
        </div>
      </div>
    </div>
  );
}