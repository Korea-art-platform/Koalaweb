interface Props {
  children: React.ReactNode;
  /** 넓은 화면에서 한 줄에 몇 개를 둘지 */
  columns?: 2 | 4;
}

/**
 * 작품을 늘어놓는 자리.
 *
 * 좁은 화면에서는 한 줄로 펼쳐 옆으로 민다. 격자로 두면 폭을 반씩 나눠
 * 가져 카드가 손톱만 해지고, 작품을 보러 온 사람에게 사진이 작아지는 것은
 * 그대로 손해다.
 *
 * 넓어지면 격자로 돌아간다. 미는 동작은 마우스로 쓰기 불편하고, 화면이
 * 넓으면 굳이 숨길 이유도 없다.
 *
 * 스크롤 막대는 감추고 스냅만 건다. 손가락을 떼면 카드가 자리를 잡아
 * 반쯤 걸친 채 멈추지 않는다.
 *
 * scroll-px-5 는 빼면 안 된다. 없으면 스냅이 좌우 여백을 건너뛰고 붙어
 * 첫 카드가 제목선보다 20px 왼쪽에서 시작한다.
 */
export default function WorkRow({ children, columns = 4 }: Props) {
  const grid = columns === 2
    ? 'md:grid md:grid-cols-2 md:gap-11'
    : 'md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8';

  return (
    <div
      className={`-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5
        no-scrollbar md:mx-0 md:snap-none md:overflow-visible md:px-0 ${grid}`}
    >
      {children}
    </div>
  );
}

/**
 * 줄 안의 한 칸.
 *
 * 좁은 화면에서는 폭을 정해 다음 카드가 살짝 보이게 한다 — 오른쪽에 더
 * 있다는 것을 화살표 없이 알린다.
 */
export function WorkCell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div
      className={`shrink-0 snap-start md:w-auto md:max-w-none md:shrink ${
        wide ? 'w-[78vw] max-w-[320px]' : 'w-[62vw] max-w-[240px]'
      }`}
    >
      {children}
    </div>
  );
}
