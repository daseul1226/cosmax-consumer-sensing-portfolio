import type { Metadata } from "next";
import { reviewEvidence } from "@/data/review-evidence";
import { analyzePortfolioData } from "@/lib/analysis";

export const metadata: Metadata = {
  title: "COSMAX Consumer Sensing Print Report",
  description: "코스맥스 지원용 소비자 센싱 포트폴리오 인쇄 전용 보고서",
};

function formatDate(value: string | null) {
  if (!value) {
    return "리뷰 페이지 기준 신호";
  }

  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatSourceKind(kind: string) {
  return kind === "review_quote" ? "공개 리뷰 인용" : "리뷰 시그널";
}

export default function PrintPage() {
  const analysis = analyzePortfolioData(reviewEvidence);
  const keyThemes = analysis.themeSignals.slice(0, 5);
  const keyPains = analysis.painSignals.slice(0, 5);
  const keySignals = analysis.marketSignals.slice(0, 5);
  const keyOpportunities = analysis.opportunityCards.slice(0, 4);
  const appendixItems = analysis.enrichedEvidence;

  return (
    <main className="print-page">
      <section className="print-cover">
        <div className="print-cover-top">
          <img alt="COSMAX logo" className="print-logo" src="../branding/cosmax-logo-main.webp" />
          <div className="print-actions">
            <a className="print-link" href="../">
              웹 버전 보기
            </a>
          </div>
        </div>

        <div className="print-title-block">
          <span className="print-eyebrow">PRINT REPORT</span>
          <h1>COSMAX Consumer Sensing Proposal</h1>
          <p>
            미국 스킨케어 시장의 Amazon 공개 리뷰와 Sephora 공개 review signal을 바탕으로 소비자 니즈를 제안 언어로 번역한
            코스맥스 지원용 인쇄 전용 보고서입니다.
          </p>
        </div>

        <div className="print-meta-grid">
          <div>
            <span>분석 리뷰 수</span>
            <strong>{analysis.metrics.totalEvidence}건</strong>
          </div>
          <div>
            <span>직접 리뷰 인용</span>
            <strong>{analysis.metrics.directReviewCount}건</strong>
          </div>
          <div>
            <span>공개 시그널</span>
            <strong>{analysis.metrics.signalCount}건</strong>
          </div>
          <div>
            <span>제안 기회 카드</span>
            <strong>{analysis.metrics.opportunityCount}개</strong>
          </div>
        </div>
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <span>Section 1</span>
          <h2>Executive Summary</h2>
        </div>
        <div className="print-summary-card">
          <p>
            이번 포트폴리오는 현재 {analysis.metrics.totalEvidence}건의 공개 리뷰를 기반으로 소비자 니즈를 추출했고, 반복 리뷰 수,
            채널 교차 여부, 시장 시그널 강도를 반영해 제안 우선순위를 점수화했습니다.
          </p>
          <p>
            입사 후에는 더 많은 글로벌 리뷰 데이터와 사내 데이터를 함께 분석해 정확도를 높이고, 고객사 제안, SKU 확장, 기존 고객 육성
            관점에서 더 정밀한 인사이트를 만들고자 합니다.
          </p>
        </div>
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <span>Section 2</span>
          <h2>Trend Signals</h2>
        </div>
        <div className="print-columns">
          <article className="print-card">
            <h3>급상승 테마</h3>
            <ul className="print-list">
              {keyThemes.map((item) => (
                <li key={`theme-${item.label}`}>
                  <strong>{item.label}</strong>
                  <span>{item.count}건</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="print-card">
            <h3>반복 불만</h3>
            <ul className="print-list">
              {keyPains.map((item) => (
                <li key={`pain-${item.label}`}>
                  <strong>{item.label}</strong>
                  <span>{item.count}건</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="print-card">
            <h3>시장 시그널</h3>
            <ul className="print-list">
              {keySignals.map((item) => (
                <li key={`signal-${item.label}`}>
                  <strong>{item.label}</strong>
                  <span>{item.count}건</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <span>Section 3</span>
          <h2>Channel Comparison</h2>
        </div>
        <div className="print-columns">
          {analysis.channelComparisons.map((channel) => (
            <article className="print-card" key={channel.source}>
              <div className="print-card-top">
                <strong>{channel.source}</strong>
                <span>{channel.averageRating ? `${channel.averageRating.toFixed(1)} / 5.0` : "signal-based"}</span>
              </div>
              <dl className="print-definition-list">
                <div>
                  <dt>분석 리뷰 수</dt>
                  <dd>{channel.evidenceCount}건</dd>
                </div>
                <div>
                  <dt>직접 리뷰 / 시그널</dt>
                  <dd>
                    {channel.directReviewCount} / {channel.signalCount}
                  </dd>
                </div>
                <div>
                  <dt>주요 테마</dt>
                  <dd>{channel.topTheme}</dd>
                </div>
                <div>
                  <dt>주요 시장 신호</dt>
                  <dd>{channel.topMarketSignal}</dd>
                </div>
              </dl>
              <p>{channel.insight}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <span>Section 4</span>
          <h2>Opportunity Score Method</h2>
        </div>
        <div className="print-columns">
          <article className="print-card">
            <h3>점수 산출 기준</h3>
            <ol className="print-ordered-list">
              <li>여러 리뷰에서 반복될수록 점수가 올라갑니다.</li>
              <li>Amazon과 Sephora처럼 복수 채널에서 함께 보이면 점수가 더 높아집니다.</li>
              <li>시장 시그널 태그가 많이 붙을수록 제안 가치가 높다고 보고 가중치를 더합니다.</li>
            </ol>
          </article>
          <article className="print-card">
            <h3>해석 원칙</h3>
            <p>일회성 의견은 제외하고, 여러 리뷰에서 반복된 니즈만 기회로 정리했습니다.</p>
            <p>현재 점수는 규칙 기반 데모 로직이며, 향후 더 많은 리뷰와 사내 데이터를 함께 분석하면 정확도를 높일 수 있습니다.</p>
          </article>
        </div>
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <span>Section 5</span>
          <h2>Opportunity & Proposal</h2>
        </div>
        <div className="print-stack">
          {keyOpportunities.map((card, index) => (
            <article className="print-card print-opportunity-card" key={card.id}>
              <div className="print-card-top">
                <span className="print-opportunity-index">{`OPPORTUNITY ${String(index + 1).padStart(2, "0")}`}</span>
                <span className="print-score-chip">{card.opportunityScore}점</span>
              </div>
              <h3>{card.title}</h3>
              <p>{card.summary}</p>
              <div className="print-note-block">
                <strong>제안 가능한 제품 콘셉트</strong>
                <p>{card.proposalConcept}</p>
              </div>
              <div className="print-note-block">
                <strong>왜 코스맥스 마케팅 직무와 연결되는가</strong>
                <p>{card.roleTie}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="print-section">
        <div className="print-section-heading">
          <span>Section 6</span>
          <h2>Evidence Appendix</h2>
        </div>
        <div className="print-appendix">
          {appendixItems.map((item, index) => (
            <article className="print-evidence-row" key={item.id}>
              <div className="print-evidence-index">{String(index + 1).padStart(2, "0")}</div>
              <div className="print-evidence-body">
                <div className="print-card-top">
                  <strong>
                    {item.source} · {formatSourceKind(item.evidence_kind)}
                  </strong>
                  <span>{item.rating ? `${item.rating}점` : item.signal_label ?? "signal"}</span>
                </div>
                <h3>{item.product_name}</h3>
                <p className="print-evidence-meta">
                  {item.brand} · {item.category} · {formatDate(item.review_date)}
                </p>
                <p>{item.review_summary}</p>
                <p className="print-evidence-link">{item.source_url}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
