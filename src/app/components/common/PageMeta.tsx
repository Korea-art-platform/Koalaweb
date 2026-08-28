import { Helmet } from 'react-helmet-async';

interface Props {
  /** 페이지 이름. "— KOALA" 는 자동으로 붙는다. */
  title: string;
  /** 검색 결과에서 제목 아래 보이는 설명. 없으면 index.html 기본값을 쓴다. */
  description?: string;
}

/**
 * 페이지마다 다른 <title> 을 준다.
 *
 * 이게 없으면 index.html 의 기본 제목을 그대로 물려받아, 검색 결과에서 모든
 * 페이지가 같은 제목으로 보인다. 검색엔진이 페이지를 구분하지 못해 순위가
 * 내려간다.
 *
 * 꼬리표("— KOALA")를 여기서 붙여 형식을 한 곳에서 맞춘다. 페이지마다 손으로
 * 적으면 누구는 "| KOALA", 누구는 "— KOALA" 로 갈린다.
 */
export default function PageMeta({ title, description }: Props) {
  return (
    <Helmet>
      <title>{title} — KOALA</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
}
