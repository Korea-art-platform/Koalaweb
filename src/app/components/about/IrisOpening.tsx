import { useScrollScene, span, ease } from '@/app/hooks/useScrollScene';

interface Props {
  lines: string[];
}

/**
 * 어두운 화면 한가운데서 빛이 퍼지며 글이 드러난다.
 *
 * 빛은 흰 원을 키워서 만든다. 실제로 커지는 게 아니라 scale 만 바꾸므로
 * 매 프레임 다시 그릴 것이 없다. blur 는 한 번만 계산되고 그대로 늘어난다.
 *
 * 글은 빛보다 늦게 들어와 빛이 충분히 퍼진 뒤에 읽힌다. 순서를 지키지 않으면
 * 어두운 바탕에 어두운 글씨가 잠깐 보이는 구간이 생긴다.
 */
export default function IrisOpening({ lines }: Props) {
  const { ref, progress, reduced } = useScrollScene<HTMLDivElement>();

  // 움직이지 않을 때는 빛도 글도 다 켜 둔 채로 멈춘다.
  const light = reduced ? 1 : ease(span(progress, 0.05, 0.62));
  const text = reduced ? 1 : span(progress, 0.42, 0.72);
  const leave = reduced ? 0 : span(progress, 0.88, 1);

  return (
    <div ref={ref} className={`relative bg-[#0D0912] ${reduced ? 'h-screen' : 'h-[260vh]'}`}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <span
          aria-hidden
          className="absolute w-[130vmax] h-[130vmax] rounded-full bg-white blur-[70px] will-change-transform"
          style={{ transform: `scale(${0.02 + light * 0.62})` }}
        />
        <div
          className="relative text-center px-6 will-change-[opacity,transform]"
          style={{ opacity: text * (1 - leave), transform: `translateY(${(1 - text) * 18}px)` }}
        >
          <img
            src="/logo-gold.svg"
            alt="KOALA — Korea Art Lab"
            width={421}
            height={117}
            className="h-11 md:h-16 w-auto mx-auto mb-8 md:mb-11"
          />
          {lines.map((line) => (
            <p
              key={line}
              className="text-2xl md:text-4xl lg:text-[2.9rem] font-bold tracking-tight text-[#0D0912] leading-[1.5] break-keep"
            >
              {line}
            </p>
          ))}
        </div>

        <span
          aria-hidden
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.28em] uppercase transition-opacity duration-500"
          style={{ opacity: reduced ? 0 : (1 - span(progress, 0, 0.12)) * 0.55, color: '#fff' }}
        >
          Scroll
        </span>
      </div>
    </div>
  );
}
