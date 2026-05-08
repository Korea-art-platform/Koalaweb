interface ArtistWorldViewProps {
  worldViewTitle?: string;
  worldViewDesc?: string;
  breadcrumb?: string;
  subBreadcrumb?: string;
}

export function ArtistWorldView({
  worldViewTitle = '작가의 세계관',
  worldViewDesc = '작가의 세계관 소개',
  breadcrumb = '작가 소개',
  subBreadcrumb,
}: ArtistWorldViewProps) {
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
