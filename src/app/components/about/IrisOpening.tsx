import { useScrollScene, span, ease } from '@/app/hooks/useScrollScene';

interface Props {
  lines: string[];
}

/**
 * 어두운 화면 한가운데서 빛이 퍼지며 글이 드러나고, 그대로 흰 화면으로 넘어간다.
 *
 * 빛은 흰 원을 키워서 만든다. 실제로 커지는 게 아니라 scale 만 바꾸므로
 * 매 프레임 다시 그릴 것이 없다. blur 는 한 번만 계산되고 그대로 늘어난다.
 *
 * 다음 씬으로 넘어가는 일을 원의 크기에 맡기지 않는다. 원이 화면을 덮으려면
 * 지름이 화면 대각선보다 커야 하는데, 그 대각선은 기기마다 다르다. 세로로 긴
 * 화면에서 원이 모자라면 위아래에 어둠이 남은 채로 씬이 끝나고, 흰 바탕인
 * 다음 씬과 맞닿아 가로선이 그어진다.
 *
 * 그래서 마지막에 흰 막을 덮는다. 화면 비율이 어떻든 무대는 반드시 순백으로
 * 끝나고, 다음 씬도 흰 바탕이라 경계가 생길 자리가 없다. 글은 막 위에 둔다.
 *
 * 글은 따로 지우지 않는다. 미리 지워 두면 다음 씬이 올라오기를 기다리는 동안
 * 글자 없는 흰 화면이 한 판 지나간다. 그냥 두면 무대와 함께 위로 밀려 나간다.
 */
export default function IrisOpening({ lines }: Props) {
  const { ref, progress, reduced } = useScrollScene<HTMLDivElement>();

  // 움직이지 않을 때는 빛과 글을 켜 둔 채로 멈춘다. 넘어갈 일이 없으니 막은 걷는다.
  const light = reduced ? 1 : ease(span(progress, 0.05, 0.5));
  const white = reduced ? 0 : span(progress, 0.52, 0.74);
  const text = reduced ? 1 : span(progress, 0.3, 0.56);

  return (
    <div ref={ref} className={`relative bg-[#0D0912] ${reduced ? 'koala-stage' : 'koala-scene-2x'}`}>
      <div className="sticky top-0 koala-stage overflow-hidden flex items-center justify-center">
        <span
          aria-hidden
          className="absolute w-[170vmax] h-[170vmax] rounded-full bg-white blur-[70px] will-change-transform"
          style={{ transform: `scale(${0.02 + light * 0.78})` }}
        />

        {/* 무대를 순백으로 마감하는 막. opacity 만 움직여 합성 단계에서 끝난다. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-white will-change-[opacity]"
          style={{ opacity: white }}
        />

        <div
          className="relative text-center px-6 will-change-[opacity,transform]"
          style={{ opacity: text, transform: `translateY(${(1 - text) * 18}px)` }}
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
