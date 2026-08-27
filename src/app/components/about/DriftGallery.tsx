import { useScrollScene, span } from '@/app/hooks/useScrollScene';
import { toCdnUrl } from '@/app/lib/imageUrl';

interface Props {
  images: string[];
  paragraphs: string[][];
}

/**
 * 작품 사진들이 대각선을 따라 화면을 가로지르고, 그 사이로 글이 읽힌다.
 *
 * 사진마다 지나는 길과 빠르기를 달리 줬다. 다 같은 속도로 움직이면 한 장의
 * 큰 판이 미끄러지는 것처럼 보여 깊이가 죽는다. 뒤쪽 사진은 작고 느리고 흐리게,
 * 앞쪽 사진은 크고 빠르고 또렷하게 둔다.
 *
 * 자리는 left/top 이 아니라 transform 으로 옮긴다. left 를 매 프레임 바꾸면
 * 그때마다 레이아웃이 다시 계산돼, 사진 여섯 장이 곧 스크롤 끊김이 된다.
 * transform 은 합성 단계에서만 처리돼 레이아웃을 건드리지 않는다.
 *
 * 단위는 vw/vh 다. 픽셀로 잡으면 창 크기가 달라질 때 사진이 글 위를 덮는다.
 */

// 진행도 0 은 "아직 시작 전"이 아니다. 무대가 화면을 꽉 채운 첫 순간이다.
// 그래서 출발 자리부터 이미 화면 안에 사진이 여러 장 놓여 있어야 한다.
// 아래에서 올라오기를 기다리게 두면 한 화면이 통째로 빈다.
//
// [출발 x(vw), 출발 y(vh), 도착 x(vw), 도착 y(vh), 크기, 기울기(deg), 흐림(px)]
const TRACKS: [number, number, number, number, number, number, number][] = [
  [ 18,  72,  46, -40, 1.00,  -8, 0],
  [ 76,  52, 104, -55, 0.72,  11, 1.5],
  [ 44, 104,  74, -30, 0.55,   6, 3],
  [ 90,  18,  64, -70, 0.88, -13, 0],
  [  8, 112,  30, -25, 0.62,   9, 2.5],
  [ 60, 140,  90, -20, 0.45,  -6, 4],
];

export default function DriftGallery({ images, paragraphs }: Props) {
  const { ref, progress, reduced } = useScrollScene<HTMLDivElement>();
  const shown = images.slice(0, TRACKS.length);

  // 움직임을 줄여야 하면 무대를 걷어내고 그냥 읽히게 둔다. 스크롤로 문단을
  // 갈아 끼우는 방식이라, 멈춰 세우면 문단 하나만 남고 나머지는 영영 안 보인다.
  if (reduced) {
    return (
      <div ref={ref} className="bg-white px-5 md:px-12 py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {paragraphs.map((block) => (
            <div key={block.join('')}>
              {block.map((line) => (
                <p
                  key={line}
                  className="text-lg md:text-2xl font-bold tracking-tight text-gray-900 leading-[1.75] break-keep"
                >
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-16 max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {shown.map((src) => (
            <img
              key={src}
              src={toCdnUrl(src)}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full aspect-[3/4] object-cover"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative koala-scene-3x bg-white">
      <div className="sticky top-0 koala-stage overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          {shown.map((src, i) => {
            const [x0, y0, x1, y1, scale, tilt, blur] = TRACKS[i];
            // 다 같이 출발하되 도착 시점을 어긋나게 둔다. 씬에 들어선 순간 이미
            // 사진이 화면에 걸쳐 있어야 하고, 그러면서도 한 덩어리로 몰려다니면 안 된다.
            const t = span(progress, 0, 0.86 + i * 0.025);
            const x = x0 + (x1 - x0) * t;
            const y = y0 + (y1 - y0) * t;
            return (
              <img
                key={src}
                src={toCdnUrl(src)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute left-0 top-0 w-[42vw] md:w-[22vw] max-w-[320px] aspect-[3/4] object-cover shadow-[0_18px_50px_-24px_rgba(62,34,89,0.45)] will-change-transform"
                style={{
                  transform:
                    `translate(calc(${x}vw - 50%), calc(${y}vh - 50%)) rotate(${tilt}deg) scale(${scale})`,
                  filter: blur ? `blur(${blur}px)` : undefined,
                  opacity: 0.42 + scale * 0.5,
                }}
              />
            );
          })}
        </div>

        {/* 사진 위로 글이 읽히도록 가운데를 밝힌다. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_58%_46%_at_50%_50%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.78)_46%,transparent_78%)]"
        />

        {/* 문단은 같은 자리에 겹쳐 두고 갈아 낀다. 세로로 쌓으면 빈 칸만 길어진다. */}
        <div className="relative h-full">
          {paragraphs.map((block, bi) => {
            // 첫 문단은 페이드인하지 않는다. 무대가 열린 순간 이미 읽을 것이 있어야 한다.
            const start = 0.04 + bi * 0.28;
            const t = bi === 0 ? 1 : span(progress, start, start + 0.11);
            const out = span(progress, start + 0.2, start + 0.28);
            const last = bi === paragraphs.length - 1;
            return (
              <div
                key={block.join('')}
                className="absolute inset-0 flex items-center justify-center px-6 will-change-[opacity,transform]"
                style={{
                  opacity: last ? t : t * (1 - out),
                  transform: `translateY(${(1 - t) * 16 - (last ? 0 : out * 12)}px)`,
                }}
              >
                <div className="max-w-2xl text-center">
                  {block.map((line) => (
                    <p
                      key={line}
                      className="text-lg md:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-gray-900 leading-[1.75] break-keep"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
