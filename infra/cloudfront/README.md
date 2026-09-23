# 링크 미리보기 — CloudFront 함수

카카오톡·페이스북 미리보기 봇은 자바스크립트를 실행하지 않는다. 우리 화면은 떠 있은 뒤에야
제목과 이미지를 바꿔 끼우므로, 봇에게는 어떤 주소를 보내도 `index.html` 의 기본값만 보인다.

그래서 **봇 요청만** 백엔드의 미리보기 자리로 돌린다. 백엔드가 그 작품·작가의 제목과 이미지를
박은 HTML 을 돌려주고, 사람이 그 주소로 들어오면 원래 화면으로 보낸다.

- 봇 판별과 돌리기: `share-bot-redirect.js` (CloudFront Function, viewer request)
- 미리보기 HTML: `ShareMetaController` (`/api/v1/share/...`)

## 왜 302 인가

CloudFront 는 **원래 주소**로 어느 행동(behavior)을 쓸지 정한 뒤 함수를 실행한다. 함수 안에서
주소만 `/api/...` 로 바꿔도 요청은 여전히 S3 로 가서 404 가 난다. 그래서 주소를 바꾸는 대신
302 로 돌려보낸다. 미리보기 봇은 302 를 따라간다.

## 설치 (CloudFront 콘솔)

1. CloudFront → **함수(Functions)** → 함수 생성
   - 이름: `koala-share-bot-redirect`
   - 런타임: **cloudfront-js-2.0**
2. `share-bot-redirect.js` 내용을 그대로 붙여넣고 **변경 사항 저장**
3. **테스트** 탭에서 확인해 본다
   - 이벤트 유형: Viewer request
   - URL 경로: `/product/1D13208F50CE4C1E`
   - 헤더에 `user-agent: facebookexternalhit/1.1` 추가 → 응답이 302 이고 `location` 이
     `/api/v1/share/product/1D13208F50CE4C1E` 이면 정상
   - user-agent 를 크롬 것으로 바꾸면 302 가 아니라 요청이 그대로 나가야 한다
4. **게시(Publish)** 탭에서 게시
5. 배포(Distribution) → 동작(Behaviors) → **기본 동작(Default (*))** 편집
   - 함수 연결 → 뷰어 요청 → CloudFront Functions → `koala-share-bot-redirect` 선택 → 저장

`/api/*` 동작은 이미 백엔드로 가므로 따로 만들 것이 없다.

## 확인

```bash
# 봇으로 요청하면 그 작품의 제목과 이미지가 담긴 HTML 이 온다
curl -s -A "facebookexternalhit/1.1" -L https://koala-art.co.kr/product/<작품코드> | grep "og:"

# 사람 브라우저는 그대로 화면이 떠야 한다
curl -s -A "Mozilla/5.0" -o /dev/null -w "%{http_code}\n" https://koala-art.co.kr/product/<작품코드>
```

카카오톡은 미리보기를 캐시한다. 바꾼 뒤에는 카카오디벨로퍼스 → 도구 → **캐시 초기화**에서
주소를 넣어 비워야 새로 보인다. 페이스북은 `developers.facebook.com/tools/debug` 에서
**Scrape Again**.

## 되돌리기

기본 동작에서 함수 연결만 지우면 원래대로 돌아간다. 배포물이나 백엔드는 건드리지 않아도 된다.
