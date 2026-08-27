import { useInView } from '@/app/hooks/useInView';

interface Props {
  children: React.ReactNode;
  /** 여러 개를 잇달아 올릴 때 순번. 한 박자씩 늦게 올라온다. */
  index?: number;
  className?: string;
}

/** 아래에서 올라오며 나타난다. transform·opacity 만 건드려 레이아웃을 흔들지 않는다. */
export default function Reveal({ children, index = 0, className = '' }: Props) {
  const { ref, seen } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${
        seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: seen ? `${index * 110}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
