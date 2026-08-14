import { Link } from 'react-router';
import { CheckCircle2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  show: boolean;
  message: string;
  showCartLink?: boolean;
  onClose: () => void;
}

export function ProductToast({ show, message, showCartLink, onClose }: Props) {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-koala-navy text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[340px]">
        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold">{message}</p>
          {showCartLink && (
            <Link to="/cart" className="text-xs text-gray-400 underline hover:text-white transition-colors">
              {t('product.detail.toast.goToCart')}
            </Link>
          )}
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
