import { useTranslation } from 'react-i18next';

interface ArtDetailHeaderProps {
  breadcrumb?: string;
  subBreadcrumb?: string;
  worldViewTitle?: string;
  worldViewDesc?: string;
}

export function ArtDetailHeader({
  breadcrumb: breadcrumbProp,
  subBreadcrumb,
  worldViewTitle: worldViewTitleProp,
  worldViewDesc: worldViewDescProp,
}: ArtDetailHeaderProps) {
  const { t } = useTranslation();
  const breadcrumb = breadcrumbProp ?? t('art.header.breadcrumb');
  const worldViewTitle = worldViewTitleProp ?? t('art.worldView.title');
  const worldViewDesc = worldViewDescProp ?? t('art.worldView.desc');
  return (
    <div className="mb-10">
      <p className="text-xs text-gray-400 mb-1">
        {breadcrumb}
        {subBreadcrumb && <span> &gt; {subBreadcrumb}</span>}
      </p>
      <h2 className="text-2xl font-bold text-gray-900 leading-tight">{worldViewTitle}</h2>
      <p className="text-sm text-gray-500 mt-1">{worldViewDesc}</p>
    </div>
  );
}
