interface ArtDetailHeaderProps {
  breadcrumb?: string;
  subBreadcrumb?: string;
  worldViewTitle?: string;
  worldViewDesc?: string;
}

export function ArtDetailHeader({
  breadcrumb = '작품 소개',
  subBreadcrumb,
  worldViewTitle = '작가의 세계관',
  worldViewDesc = '작가의 세계관 소개',
}: ArtDetailHeaderProps) {
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
