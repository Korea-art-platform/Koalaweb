import { useTranslation } from 'react-i18next';
interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-16">
      <button
        onClick={() => setPage((p) => Math.max(0, p - 1))}
        disabled={page === 0}
        className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors">
        {t('common.prev')}
      </button>
      <span className="px-6 py-2 text-sm text-gray-500">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        disabled={page === totalPages - 1}
        className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors">
        {t('common.next')}
      </button>
    </div>
  );
}
