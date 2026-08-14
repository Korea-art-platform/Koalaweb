interface ArtistInterviewProps {
  videoUrl?: string;
  thumbnailUrl?: string;
}

function isEmbedUrl(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

export function ArtistInterview({ videoUrl, thumbnailUrl }: ArtistInterviewProps) {
  if (!videoUrl && !thumbnailUrl) return null;

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">INTERVIEW</p>
      <div className="w-full aspect-video bg-[#D6C9A8] overflow-hidden">
        {videoUrl ? (
          isEmbedUrl(videoUrl) ? (
            <iframe
              src={videoUrl}
              title="Artist Interview"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-cover"
              poster={thumbnailUrl}
            />
          )
        ) : thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Interview" className="w-full h-full object-cover" />
        ) : null}
      </div>
    </section>
  );
}
