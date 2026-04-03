"use client";

import { useEffect, useState } from "react";
import { analyzePortfolioData, filterReviews, getFilterOptions } from "@/lib/analysis";
import { EnrichedReview, FilterState, OpportunityCard, ReviewRecord } from "@/lib/types";

const defaultFilters: FilterState = {
  source: "all",
  brand: "all",
  category: "all",
  ratingBand: "all",
  keyword: "",
  search: "",
};

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getSourceTone(source: string) {
  return source === "Amazon" ? "source-chip amazon" : "source-chip sephora";
}

function EvidenceDetail({ card, review }: { card: OpportunityCard; review: EnrichedReview }) {
  return (
    <article className="detail-card">
      <div className="detail-header">
        <div>
          <span className={getSourceTone(review.source)}>{review.source}</span>
          <h3>{review.product_name}</h3>
        </div>
        <div className="detail-score">
          <strong>{review.opportunity_score}</strong>
          <span>review score</span>
        </div>
      </div>

      <div className="detail-meta-grid">
        <div>
          <span>브랜드</span>
          <strong>{review.brand}</strong>
        </div>
        <div>
          <span>카테고리</span>
          <strong>{review.category}</strong>
        </div>
        <div>
          <span>피부 고민</span>
          <strong>{review.skin_concern}</strong>
        </div>
        <div>
          <span>평점</span>
          <strong>{review.rating} / 5</strong>
        </div>
      </div>

      <blockquote className="review-quote">{review.review_text}</blockquote>

      <div className="tag-section">
        <span>테마 태그</span>
        <div className="inline-tags">
          {review.theme_tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="tag-section">
        <span>반복 이슈</span>
        <div className="inline-tags warning">
          {review.pain_point_tags.length > 0 ? review.pain_point_tags.map((tag) => <span key={tag}>{tag}</span>) : <span>없음</span>}
        </div>
      </div>

      <div className="tag-section">
        <span>프리미엄 신호</span>
        <div className="inline-tags premium">
          {review.premium_signal_tags.length > 0 ? review.premium_signal_tags.map((tag) => <span key={tag}>{tag}</span>) : <span>없음</span>}
        </div>
      </div>

      <div className="detail-panel">
        <strong>제안으로 번역하면</strong>
        <p>{card.salesTalkingPoint}</p>
      </div>

      <div className="detail-panel muted">
        <strong>왜 직무와 연결되는가</strong>
        <p>{card.roleTie}</p>
      </div>
    </article>
  );
}

export default function PortfolioDashboard({ reviews }: { reviews: ReviewRecord[] }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeOpportunityId, setActiveOpportunityId] = useState("");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState("");

  const filterOptions = getFilterOptions(reviews);
  const filteredReviews = filterReviews(reviews, filters);
  const analysis = analyzePortfolioData(filteredReviews);
  const activeOpportunity =
    analysis.opportunityCards.find((card) => card.id === activeOpportunityId) ?? analysis.opportunityCards[0] ?? null;
  const selectedEvidence =
    (activeOpportunity?.evidenceReviews ?? analysis.enrichedReviews).find((review) => review.review_title === selectedEvidenceId) ??
    (activeOpportunity?.evidenceReviews ?? analysis.enrichedReviews)[0] ??
    null;

  useEffect(() => {
    if (analysis.opportunityCards.length === 0) {
      if (activeOpportunityId !== "") {
        setActiveOpportunityId("");
      }

      return;
    }

    if (!analysis.opportunityCards.some((card) => card.id === activeOpportunityId)) {
      setActiveOpportunityId(analysis.opportunityCards[0].id);
    }
  }, [activeOpportunityId, analysis.opportunityCards]);

  useEffect(() => {
    const evidencePool = activeOpportunity?.evidenceReviews ?? analysis.enrichedReviews;

    if (evidencePool.length === 0) {
      if (selectedEvidenceId !== "") {
        setSelectedEvidenceId("");
      }

      return;
    }

    if (!evidencePool.some((review) => review.review_title === selectedEvidenceId)) {
      setSelectedEvidenceId(evidencePool[0].review_title);
    }
  }, [activeOpportunity, analysis.enrichedReviews, selectedEvidenceId]);

  return (
    <main className="page-shell">
      <div className="page-backdrop" />
      <section className="hero-card">
        <div className="eyebrow-row">
          <span className="eyebrow">COSMAX CONSUMER STRATEGY PORTFOLIO</span>
          <span className="eyebrow-subtle">Amazon · Sephora · US Skincare</span>
        </div>
        <div className="hero-grid">
          <div>
            <p className="hero-kicker">Made by COSMAX를 프리미엄 신뢰의 기준으로 연결하는 소비자 센싱 데모</p>
            <h1>미국 스킨케어 리뷰를 분석해 고객사 제안 가능한 K-뷰티 기회를 도출하는 트렌드 센싱 포트폴리오</h1>
            <p className="hero-description">
              단순 리뷰 요약이 아니라, 소비자 표현을 신제품 제안 포인트와 기존 고객사 육성 언어로 번역하는 흐름에
              초점을 맞췄습니다. 코스맥스 신년사의 <strong>CONSUMER 전략</strong>을 실무형 웹 경험으로 재구성했습니다.
            </p>
          </div>
          <div className="hero-aside">
            <div className="mini-panel">
              <span className="mini-label">직무 연결</span>
              <p>국내 고객사 신제품 제안, 발주 대응, 기존 고객 육성에 바로 연결되는 인사이트 구조</p>
            </div>
            <div className="mini-panel">
              <span className="mini-label">데이터 범위</span>
              <p>미국 스킨케어 리뷰 {reviews.length}건을 기준으로 Amazon과 Sephora를 비교 분석</p>
            </div>
            <div className="mini-panel">
              <span className="mini-label">결과물 형태</span>
              <p>차트보다 제안서형 해석과 근거 리뷰를 강조하는 세일즈 친화형 대시보드</p>
            </div>
          </div>
        </div>
        <div className="workflow-strip">
          <div className="workflow-step"><span>01</span><p>리뷰 수집</p></div>
          <div className="workflow-step"><span>02</span><p>테마·불만·프리미엄 신호 분류</p></div>
          <div className="workflow-step"><span>03</span><p>기회 점수 산출</p></div>
          <div className="workflow-step"><span>04</span><p>고객사 제안 포인트로 번역</p></div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card"><span className="stat-label">분석 대상 리뷰</span><strong>{analysis.metrics.totalReviews}건</strong><p>필터 기준으로 실시간 반영되는 리뷰 모수</p></article>
        <article className="stat-card"><span className="stat-label">평균 평점</span><strong>{analysis.metrics.averageRating.toFixed(1)} / 5.0</strong><p>기본 만족도와 제형 개선 여지를 함께 읽는 기준</p></article>
        <article className="stat-card"><span className="stat-label">프리미엄 신호 비중</span><strong>{formatPercent(analysis.metrics.premiumShare)}</strong><p>고급화 메시지로 연결 가능한 감각형 표현 비율</p></article>
        <article className="stat-card"><span className="stat-label">제안 기회 카드</span><strong>{analysis.metrics.opportunityCount}개</strong><p>현재 필터 기준에서 도출되는 고객사 제안 시나리오</p></article>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="section-index">Section 2</span>
            <h2>Trend Sensing Dashboard</h2>
          </div>
          <p>플랫폼, 브랜드, 카테고리, 평점 구간, 키워드 기준으로 소비자 신호를 좁혀볼 수 있습니다.</p>
        </div>

        <div className="filter-toolbar">
          <label>
            <span>플랫폼</span>
            <select value={filters.source} onChange={(event) => setFilters({ ...filters, source: event.target.value })}>
              <option value="all">전체</option>
              <option value="Amazon">Amazon</option>
              <option value="Sephora">Sephora</option>
            </select>
          </label>
          <label>
            <span>브랜드</span>
            <select value={filters.brand} onChange={(event) => setFilters({ ...filters, brand: event.target.value })}>
              <option value="all">전체</option>
              {filterOptions.brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </label>
          <label>
            <span>제품군</span>
            <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
              <option value="all">전체</option>
              {filterOptions.categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label>
            <span>평점 구간</span>
            <select value={filters.ratingBand} onChange={(event) => setFilters({ ...filters, ratingBand: event.target.value })}>
              <option value="all">전체</option>
              <option value="high">긍정 4-5점</option>
              <option value="mixed">혼합 3점</option>
              <option value="low">이슈 1-2점</option>
            </select>
          </label>
          <label className="search-field">
            <span>리뷰 검색</span>
            <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value.toLowerCase() })} placeholder="예: sticky, sensitive, premium" />
          </label>
          <button className="ghost-button" onClick={() => setFilters(defaultFilters)} type="button">필터 초기화</button>
        </div>

        <div className="keyword-row">
          <span>추천 키워드</span>
          <div className="keyword-chips">
            {analysis.keywordOptions.slice(0, 8).map((keyword) => {
              const active = filters.keyword === keyword;

              return (
                <button className={active ? "chip active" : "chip"} key={keyword} onClick={() => setFilters({ ...filters, keyword: active ? "" : keyword })} type="button">
                  {keyword}
                </button>
              );
            })}
          </div>
        </div>

        {analysis.metrics.totalReviews === 0 ? (
          <div className="empty-state">
            <h3>조건에 맞는 리뷰가 없습니다.</h3>
            <p>필터를 조금 완화하면 다시 제안 가능한 인사이트를 확인할 수 있습니다.</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            <article className="panel">
              <div className="panel-header"><h3>급상승 키워드</h3><p>최근성 가중치를 반영한 핵심 테마</p></div>
              <div className="bar-list">
                {analysis.themeSignals.slice(0, 5).map((signal) => (
                  <div className="bar-row" key={signal.label}>
                    <div className="bar-copy"><strong>{signal.label}</strong><span>{signal.count}건</span></div>
                    <div className="bar-track"><div className="bar-fill accent" style={{ width: `${Math.min(signal.weight, 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panel-header"><h3>반복 불만</h3><p>개선 제안으로 연결할 수 있는 이슈</p></div>
              <div className="stack-list">
                {analysis.painSignals.slice(0, 5).map((signal) => <div className="stack-item warning" key={signal.label}><strong>{signal.label}</strong><span>{signal.count}건</span></div>)}
              </div>
              <p className="annotation">반복 이슈 비중은 <strong>{formatPercent(analysis.metrics.repeatedIssueShare)}</strong>입니다. 영업 단계에서 리뉴얼형 제안 포인트로 전환할 수 있습니다.</p>
            </article>

            <article className="panel">
              <div className="panel-header"><h3>프리미엄 연상 표현</h3><p>고급화 설득에 쓸 수 있는 감각 언어</p></div>
              <div className="signal-cloud">
                {analysis.premiumSignals.slice(0, 5).map((signal) => <span className="cloud-chip" key={signal.label}>{signal.label}<strong>{signal.count}</strong></span>)}
              </div>
              <p className="annotation">프리미엄 신호는 제품 효능 설명보다 상위 포지셔닝 제안에 유효합니다.</p>
            </article>

            <article className="panel">
              <div className="panel-header"><h3>별점 분포</h3><p>만족과 불만이 갈리는 구간 확인</p></div>
              <div className="rating-distribution">
                {analysis.ratingDistribution.map((bucket) => (
                  <div className="rating-row" key={bucket.stars}>
                    <span>{bucket.stars}점</span>
                    <div className="bar-track"><div className="bar-fill dark" style={{ width: `${analysis.metrics.totalReviews === 0 ? 0 : (bucket.count / analysis.metrics.totalReviews) * 100}%` }} /></div>
                    <strong>{bucket.count}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel full-width">
              <div className="panel-header"><h3>채널별 차이</h3><p>Amazon과 Sephora에서 읽히는 소비자 언어의 차이</p></div>
              <div className="channel-grid">
                {analysis.channelComparisons.map((channel) => (
                  <div className="channel-card" key={channel.source}>
                    <div className="channel-top"><span className={getSourceTone(channel.source)}>{channel.source}</span><strong>{channel.averageRating.toFixed(1)} / 5.0</strong></div>
                    <dl>
                      <div><dt>리뷰 수</dt><dd>{channel.reviewCount}건</dd></div>
                      <div><dt>주요 테마</dt><dd>{channel.topTheme}</dd></div>
                      <div><dt>대표 이슈</dt><dd>{channel.topPainPoint}</dd></div>
                      <div><dt>프리미엄 비중</dt><dd>{formatPercent(channel.premiumShare)}</dd></div>
                    </dl>
                    <p>{channel.insight}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div><span className="section-index">Section 3</span><h2>Proposal Opportunity Board</h2></div>
          <p>분석 결과를 코스맥스 마케팅 직무의 언어로 번역한 고객사 제안 시나리오입니다.</p>
        </div>
        <div className="opportunity-grid">
          {analysis.opportunityCards.map((card) => {
            const active = activeOpportunity?.id === card.id;

            return (
              <button className={active ? "opportunity-card active" : "opportunity-card"} key={card.id} onClick={() => setActiveOpportunityId(card.id)} type="button">
                <div className="opportunity-top"><span>기회 점수 {card.opportunityScore}</span><span>{card.evidenceCount}개 리뷰 근거</span></div>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                <div className="opportunity-tags">{card.dominantTags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="opportunity-note"><strong>제안 콘셉트</strong><p>{card.proposalConcept}</p></div>
                <div className="opportunity-note"><strong>직무 연결</strong><p>{card.roleTie}</p></div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div><span className="section-index">Section 4</span><h2>Evidence Viewer</h2></div>
          <p>선택한 기회 카드와 연결된 실제 리뷰를 확인하면서 인사이트의 근거를 점검할 수 있습니다.</p>
        </div>

        {activeOpportunity ? (
          <div className="evidence-layout">
            <div className="evidence-list">
              <div className="evidence-summary">
                <span className="eyebrow">SELECTED OPPORTUNITY</span>
                <h3>{activeOpportunity.title}</h3>
                <p>{activeOpportunity.salesTalkingPoint}</p>
                <blockquote>{activeOpportunity.representativeQuote}</blockquote>
              </div>
              {activeOpportunity.evidenceReviews.map((review) => {
                const active = selectedEvidence?.review_title === review.review_title;

                return (
                  <button className={active ? "evidence-item active" : "evidence-item"} key={`${review.source}-${review.product_name}-${review.review_title}`} onClick={() => setSelectedEvidenceId(review.review_title)} type="button">
                    <div className="evidence-head"><span className={getSourceTone(review.source)}>{review.source}</span><span>{review.brand}</span></div>
                    <strong>{review.product_name}</strong>
                    <p>{review.review_title}</p>
                    <div className="evidence-meta"><span>{review.rating}점</span><span>{review.sentiment_label}</span><span>{formatDate(review.review_date)}</span></div>
                  </button>
                );
              })}
            </div>

            <div className="evidence-detail">
              {selectedEvidence ? <EvidenceDetail card={activeOpportunity} review={selectedEvidence} /> : <div className="empty-state compact"><h3>근거 리뷰를 선택해주세요.</h3></div>}
            </div>
          </div>
        ) : (
          <div className="empty-state compact">
            <h3>현재 필터에서는 제안 카드가 생성되지 않았습니다.</h3>
            <p>필터를 완화하거나 키워드를 바꿔 더 넓은 신호를 확인해보세요.</p>
          </div>
        )}
      </section>
    </main>
  );
}
