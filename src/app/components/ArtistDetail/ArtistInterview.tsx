interface ArtistInterviewProps {
  videoUrl?: string;
  thumbnailUrl?: string;
}

export function ArtistInterview({ videoUrl, thumbnailUrl }: ArtistInterviewProps) {
  if (!videoUrl && !thumbnailUrl) return null;

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">INTERVIEW</p>
      <div className="w-full aspect-video bg-[#D6C9A8] overflow-hidden">
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title="Artist Interview"
            className="w-full h-full"
            allowFullScreen
          />
        ) : thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Interview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm text-gray-500">인터뷰 영상</span>
          </div>
        )}
      </div>
    </section>
  );
}
