# COSMAX Consumer Sensing Portfolio

미국 스킨케어 시장의 Amazon·Sephora 리뷰를 바탕으로, 소비자 목소리를 고객사 제안 인사이트로 번역하는 코스맥스 지원용 포트폴리오 웹앱입니다.

## 핵심 구성

- `Trend Sensing Dashboard`: 플랫폼, 브랜드, 제품군, 평점 구간, 키워드 기준 필터링
- `Proposal Opportunity Board`: 리뷰 신호를 제안 콘셉트로 번역한 카드형 인사이트
- `Evidence Viewer`: 실제 리뷰 원문과 분류 태그를 근거로 보여주는 검증 화면

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## GitHub Pages 배포

`main` 브랜치에 푸시하면 `.github/workflows/deploy-pages.yml`이 실행되어 GitHub Pages로 정적 사이트를 배포합니다.

- 사용자 페이지(`username.github.io`)가 아니면 자동으로 저장소 이름을 `basePath`로 적용합니다.
- 배포 결과는 `https://<github-id>.github.io/<repo-name>/` 형태의 공개 링크로 확인할 수 있습니다.
