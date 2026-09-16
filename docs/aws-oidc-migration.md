# AWS 액세스 키 → OIDC 역할 전환 안내

## 왜 바꾸나

지금 `deploy.yml` 은 장기 액세스 키(`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)를
저장소 시크릿에 넣어 쓴다. 이 방식의 문제는 두 가지다.

- **만료가 없다.** 한 번 새면 사람이 직접 폐기할 때까지 계속 유효하다.
- **어디서든 쓸 수 있다.** 키만 있으면 GitHub Actions 밖에서도 그대로 쓸 수 있다.

OIDC 로 바꾸면 GitHub 가 실행할 때마다 **수명이 짧은 임시 자격증명**을 발급받는다.
저장소에 보관되는 비밀이 없어지고, 신뢰 정책에 적은 저장소·브랜치에서만 역할을 맡을 수 있다.

> **이 문서는 아직 적용하지 않았다.** IAM 역할을 만드는 건 계정 권한이 있는 대표님 몫이라
> 절차만 적어 둔다. 아래 1~4 를 끝내고 5 의 워크플로 수정을 반영하면 전환이 끝난다.

아래 `<...>` 는 전부 자리표시자다. **실제 값은 추측하지 말고 콘솔에서 확인해 채운다.**

| 자리표시자 | 어디서 확인 |
|---|---|
| `<AWS_ACCOUNT_ID>` | AWS 콘솔 우측 상단 계정 번호 (12자리) |
| `<S3_BUCKET_NAME>` | 현재 `AWS_S3_BUCKET` 시크릿에 든 버킷 이름 |
| `<CLOUDFRONT_DISTRIBUTION_ID>` | 현재 `AWS_CLOUDFRONT_DISTRIBUTION_ID` 시크릿 값 |
| `<AWS_REGION>` | 현재 `AWS_REGION` 시크릿 값 (예: `ap-northeast-2`) |
| `<ROLE_NAME>` | 새로 만들 역할 이름 (예: `github-actions-koalaweb-deploy`) |

---

## 1. GitHub 를 OIDC 공급자로 등록

IAM → **자격 증명 공급자(Identity providers)** → 공급자 추가

- 공급자 유형: **OpenID Connect**
- 공급자 URL: `https://token.actions.githubusercontent.com`
- 대상(Audience): `sts.amazonaws.com`

계정에 이미 등록돼 있으면 다시 만들지 말고 그대로 쓴다.
(지문/thumbprint 는 요즘 AWS 가 알아서 관리하므로 따로 입력하지 않아도 된다.)

## 2. 신뢰 정책 — 이 저장소의 main 에서만

역할을 새로 만들고 신뢰 관계(Trust relationship)에 아래를 넣는다.
`sub` 조건이 **핵심**이다. 이게 없으면 아무 저장소나 이 역할을 맡을 수 있다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<AWS_ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:Korea-art-platform/Koalaweb:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

`sub` 를 `repo:Korea-art-platform/Koalaweb:*` 처럼 넓히지 않는다. 그렇게 하면 이 저장소의
**아무 브랜치나 PR** 에서도 배포 역할을 맡을 수 있게 되어, 포크 PR 로 운영 버킷을 건드릴 여지가 생긴다.

> 나중에 태그 배포나 스테이징 브랜치를 추가한다면 `StringEquals` 대신 `StringLike` 로 바꾸고
> 필요한 ref 만 하나씩 열거한다. 그때도 `*` 하나로 뭉뚱그리지 않는다.

## 3. 권한 정책 — 그 버킷, 그 배포판만

역할에 붙일 정책. 지금 워크플로가 실제로 하는 일(= `aws s3 sync --delete` 와
`cloudfront create-invalidation`)에 딱 맞춘 것이다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListTargetBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::<S3_BUCKET_NAME>"
    },
    {
      "Sid": "SyncObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::<S3_BUCKET_NAME>/*"
    },
    {
      "Sid": "InvalidateDistribution",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::<AWS_ACCOUNT_ID>:distribution/<CLOUDFRONT_DISTRIBUTION_ID>"
    }
  ]
}
```

두 가지만 짚어 둔다.

- `s3:DeleteObject` 는 `--delete` 때문에 필요하다. 빼면 배포는 되지만 지워진 파일이 버킷에 남는다.
- `s3:ListBucket` 의 리소스는 버킷 ARN(`/*` 없음), 객체 권한은 `/*` 붙은 쪽이다. 둘은 다른 리소스다.

`AdministratorAccess` 나 `AmazonS3FullAccess` 같은 관리형 정책을 붙이지 않는다.
전환의 목적이 권한을 좁히는 것인데 그러면 의미가 없다.

## 4. 역할 ARN 확인

만들어진 역할의 ARN 을 적어 둔다.

```
arn:aws:iam::<AWS_ACCOUNT_ID>:role/<ROLE_NAME>
```

## 5. 워크플로 수정

`.github/workflows/deploy.yml` 을 아래와 같이 바꾼다.

```diff
 permissions:
   contents: read

 jobs:
   deploy:
     runs-on: ubuntu-latest
+    # OIDC 토큰 발급에 필요하다. 최상위는 contents: read 로 두고
+    # 이 잡에서만 넓힌다.
+    permissions:
+      contents: read
+      id-token: write

     steps:
```

```diff
       # ── 5. AWS 인증 ─────────────────────────────────────────────────────────
       - name: Configure AWS credentials
         uses: aws-actions/configure-aws-credentials@7474bc4690e29a8392af63c5b98e7449536d5c3a # v4.3.1
         with:
-          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
-          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
-          aws-region: ${{ secrets.AWS_REGION }}
+          role-to-assume: arn:aws:iam::<AWS_ACCOUNT_ID>:role/<ROLE_NAME>
+          aws-region: <AWS_REGION>
```

`role-to-assume` 은 비밀이 아니다(계정 번호가 드러나지만 그것만으로 할 수 있는 일이 없다).
그래도 신경 쓰이면 `vars.AWS_DEPLOY_ROLE_ARN` 같은 저장소 Variable 로 빼도 된다.

`AWS_S3_BUCKET` 과 `AWS_CLOUDFRONT_DISTRIBUTION_ID` 시크릿은 **그대로 둔다.**
6~7번 스텝이 계속 쓴다.

## 6. 전환이 끝난 뒤 정리

여기까지 하고 배포가 한 번 성공하는 걸 확인한 다음에 정리한다. 순서가 중요하다 —
먼저 지우면 되돌릴 방법이 없다.

1. main 에 푸시해서 배포가 성공하는지 확인한다.
2. IAM 에서 기존 배포용 사용자의 **액세스 키를 비활성화(Inactive)** 한다. 아직 지우지 않는다.
3. 며칠 지켜보고 문제가 없으면 액세스 키를 **삭제**하고, 그 사용자가 다른 데 쓰이지 않으면 사용자도 지운다.
4. 저장소 시크릿에서 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 를 삭제한다.
   (`AWS_REGION` 은 워크플로에 직접 적었다면 같이 지운다.)

## 참고

- [GitHub — OpenID Connect 로 AWS 에 인증하기](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials)
