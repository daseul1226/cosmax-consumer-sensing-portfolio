"use client";

import { useEffect, useState } from "react";
import { analyzePortfolioData, filterEvidence, getFilterOptions } from "@/lib/analysis";
import { ConsumerEvidence, EnrichedEvidence, FilterState, OpportunityCard } from "@/lib/types";

const defaultFilters: FilterState = {
  source: "all",
  evidenceKind: "all",
  brand: "all",
  category: "all",
  ratingBand: "all",
  keyword: "",
  search: "",
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

function formatNumber(value: number | null) {
  if (value === null) {
    return "-";
  }

  return value.toLocaleString("en-US");
}

function getSourceTone(source: string) {
  return source === "Amazon" ? "source-chip amazon" : "source-chip sephora";
}

function getEvidenceKindLabel(kind: string) {
  return kind === "review_quote" ? "공개 리뷰 인용" : "리뷰 시그널";
}

function EvidenceDetail({ card, evidence }: { card: OpportunityCard; evidence: EnrichedEvidence }) {
  return (
    <article className="detail-card">
      <div className="detail-header">
        <div>
          <div className="keyword-chips">
            <span className={getSourceTone(evidence.source)}>{evidence.source}</span>
            <span className="cloud-chip">{getEvidenceKindLabel(evidence.evidence_kind)}</span>
          </div>
          <h3>{evidence.product_name}</h3>
        </div>
        <div className="detail-score">
          <strong>{evidence.opportunity_score}</strong>
          <span>opportunity score</span>
        </div>
      </div>

      <div className="detail-meta-grid">
        <div>
          <span>브랜드</span>
          <strong>{evidence.brand}</strong>
        </div>
        <div>
          <span>카테고리</span>
          <strong>{evidence.category}</strong>
        </div>
        <div>
          <span>피부 고민</span>
          <strong>{evidence.skin_concern}</strong>
        </div>
        <div>
          <span>평점 또는 타입</span>
          <strong>{evidence.rating ? `${evidence.rating} / 5` : getEvidenceKindLabel(evidence.evidence_kind)}</strong>
        </div>
      </div>

      <blockquote className="review-quote">
        {evidence.quote_excerpt ?? evidence.review_summary}
      </blockquote>

      <div className="detail-panel muted">
        <strong>근거 설명</strong>
        <p>{evidence.review_summary}</p>
      </div>

      <div className="tag-section">
        <span>핵심 테마</span>
        <div className="inline-tags">
          {evidence.theme_tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div className="tag-section">
        <span>반복 이슈</span>
        <div className="inline-tags warning">
          {evidence.pain_point_tags.length > 0 ? evidence.pain_point_tags.map((tag) => <span key={tag}>{tag}</span>) : <span>없음</span>}
        </div>
      </div>

      <div className="tag-section">
        <span>시장 시그널</span>
        <div className="inline-tags premium">
          {evidence.market_signal_tags.length > 0 ? evidence.market_signal_tags.map((tag) => <span key={tag}>{tag}</span>) : <span>없음</span>}
        </div>
      </div>

      <div className="detail-panel">
        <strong>제안서 언어로 번역</strong>
        <p>{card.salesTalkingPoint}</p>
      </div>

      <div className="detail-panel muted">
        <strong>출처 및 캡처 정보</strong>
        <p>
          {evidence.source_domain} · 캡처 {formatDate(evidence.captured_at)} · 리뷰일 {formatDate(evidence.review_date)}
          {evidence.reviewer_alias ? ` · reviewer ${evidence.reviewer_alias}` : ""}
          {evidence.review_count ? ` · visible review base ${formatNumber(evidence.review_count)}` : ""}
        </p>
        <a className="source-link" href={evidence.source_url} rel="noreferrer" target="_blank">
          원문 상품 페이지 보기
        </a>
      </div>
    </article>
  );
}

export default function PortfolioDashboard({ evidenceItems }: { evidenceItems: ConsumerEvidence[] }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeOpportunityId, setActiveOpportunityId] = useState("");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState("");

  const filterOptions = getFilterOptions(evidenceItems);
  const filteredEvidence = filterEvidence(evidenceItems, filters);
  const analysis = analyzePortfolioData(filteredEvidence);
  const activeOpportunity =
    analysis.opportunityCards.find((card) => card.id === activeOpportunityId) ?? analysis.opportunityCards[0] ?? null;
  const finalProposalCards = analysis.opportunityCards.slice(0, 3);
  const selectedEvidence =
    (activeOpportunity?.evidenceItems ?? analysis.enrichedEvidence).find((item) => item.id === selectedEvidenceId) ??
    (activeOpportunity?.evidenceItems ?? analysis.enrichedEvidence)[0] ??
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
    const evidencePool = activeOpportunity?.evidenceItems ?? analysis.enrichedEvidence;

    if (evidencePool.length === 0) {
      if (selectedEvidenceId !== "") {
        setSelectedEvidenceId("");
      }

      return;
    }

    if (!evidencePool.some((item) => item.id === selectedEvidenceId)) {
      setSelectedEvidenceId(evidencePool[0].id);
    }
  }, [activeOpportunity, analysis.enrichedEvidence, selectedEvidenceId]);

  return (
    <main className="page-shell">
      <div className="page-backdrop" />

      <section className="hero-card">
        <div className="eyebrow-row">
          <span className="eyebrow">COSMAX CONSUMER STRATEGY PORTFOLIO</span>
          <span className="eyebrow-subtle">Amazon public reviews + Sephora public review signals</span>
        </div>
        <div className="hero-grid">
          <div>
            <div className="brand-lockup">
              <img alt="COSMAX logo" className="brand-logo" height={72} src="branding/cosmax-logo-main.webp" width={274} />
              <p>Premium trust, consumer-first sensing, proposal-ready translation</p>
            </div>
            <h1>COSMAX Consumer Sensing Proposal</h1>
            <p className="hero-description">
              이 화면은 라이브 크롤러가 아니라 <strong>실제 공개 리뷰 인용과 상품 페이지 시그널을 수동 큐레이션한 데이터셋</strong>
              을 기반으로 작동합니다.
            </p>
          </div>

          <div className="hero-aside">
            <div className="mini-panel">
              <span className="mini-label">데이터 구조</span>
              <p>Amazon은 공개 리뷰 인용, Sephora는 공개 상품 페이지의 review signal을 분리해 실제 근거 구조를 투명하게 보여줍니다.</p>
            </div>
            <div className="mini-panel">
              <span className="mini-label">직무 연결</span>
              <p>트렌드 읽기에서 끝나지 않고 고객사 제안 포인트, SKU 확장 논리, 육성 메시지까지 이어지도록 해석했습니다.</p>
            </div>
          </div>
        </div>

        <div className="workflow-strip">
          <div className="workflow-step">
            <span>01</span>
            <p>공개 리뷰와 시그널 수집</p>
          </div>
          <div className="workflow-step">
            <span>02</span>
            <p>보습, 저자극, 사용감, 프리미엄감 분류</p>
          </div>
          <div className="workflow-step">
            <span>03</span>
            <p>반복 니즈와 제형 기회 점수화</p>
          </div>
          <div className="workflow-step">
            <span>04</span>
            <p>고객사 제안 문장으로 번역</p>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">전체 근거</span>
          <strong>{analysis.metrics.totalEvidence}건</strong>
          <p>실제 공개 근거만 남긴 상태에서 필터에 맞춰 다시 계산됩니다.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">직접 리뷰 인용</span>
          <strong>{analysis.metrics.directReviewCount}건</strong>
          <p>Amazon 공개 리뷰 문맥을 요약해 넣은 근거입니다.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">공개 시그널</span>
          <strong>{analysis.metrics.signalCount}건</strong>
          <p>Sephora 상품 페이지의 반복 review signal을 별도 구조로 보관했습니다.</p>
        </article>
        <article className="stat-card">
          <span className="stat-label">제안 기회 카드</span>
          <strong>{analysis.metrics.opportunityCount}개</strong>
          <p>근거가 2건 이상 겹치는 영역만 카드로 노출해 과장된 해석을 줄였습니다.</p>
        </article>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="section-index">Section 2</span>
            <h2>Trend Sensing Dashboard</h2>
          </div>
          <p>플랫폼, 근거 타입, 브랜드, 카테고리, 평점 구간, 키워드를 조합해 소비자 신호를 제안 가능한 언어로 읽습니다.</p>
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
            <span>근거 타입</span>
            <select
              value={filters.evidenceKind}
              onChange={(event) => setFilters({ ...filters, evidenceKind: event.target.value })}
            >
              <option value="all">전체</option>
              <option value="review_quote">공개 리뷰 인용</option>
              <option value="review_signal">리뷰 시그널</option>
            </select>
          </label>
          <label>
            <span>브랜드</span>
            <select value={filters.brand} onChange={(event) => setFilters({ ...filters, brand: event.target.value })}>
              <option value="all">전체</option>
              {filterOptions.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>카테고리</span>
            <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
              <option value="all">전체</option>
              {filterOptions.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>평점 구간</span>
            <select value={filters.ratingBand} onChange={(event) => setFilters({ ...filters, ratingBand: event.target.value })}>
              <option value="all">전체</option>
              <option value="high">직접 리뷰 4-5점</option>
              <option value="mixed">직접 리뷰 3점</option>
              <option value="low">직접 리뷰 1-2점</option>
              <option value="signal">리뷰 시그널만</option>
            </select>
          </label>
          <label className="search-field">
            <span>근거 검색</span>
            <input
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
              placeholder="dry skin, layering, premium"
            />
          </label>
          <button className="ghost-button" onClick={() => setFilters(defaultFilters)} type="button">
            필터 초기화
          </button>
        </div>

        <div className="keyword-row">
          <span>추천 키워드</span>
          <div className="keyword-chips">
            {analysis.keywordOptions.slice(0, 8).map((keyword) => {
              const active = filters.keyword === keyword;

              return (
                <button
                  className={active ? "chip active" : "chip"}
                  key={keyword}
                  onClick={() => setFilters({ ...filters, keyword: active ? "" : keyword })}
                  type="button"
                >
                  {keyword}
                </button>
              );
            })}
          </div>
        </div>

        {analysis.metrics.totalEvidence === 0 ? (
          <div className="empty-state">
            <h3>조건에 맞는 공개 근거가 없습니다.</h3>
            <p>필터를 조금 완화하면 다시 제안 가능한 인사이트를 확인할 수 있습니다.</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            <article className="panel">
              <div className="panel-header">
                <h3>급상승 테마</h3>
                <p>반복 언급된 보습, 저자극, 사용감 신호</p>
              </div>
              <div className="bar-list">
                {analysis.themeSignals.slice(0, 5).map((signal) => (
                  <div className="bar-row" key={signal.label}>
                    <div className="bar-copy">
                      <strong>{signal.label}</strong>
                      <span>{signal.count}건</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill accent" style={{ width: `${Math.min(signal.weight, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel">
              <div className="panel-header">
                <h3>반복 불만과 리스크</h3>
                <p>직접 리뷰에서 주로 드러나는 제형 개선 포인트</p>
              </div>
              <div className="stack-list">
                {analysis.painSignals.slice(0, 5).map((signal) => (
                  <div className="stack-item warning" key={signal.label}>
                    <strong>{signal.label}</strong>
                    <span>{signal.count}건</span>
                  </div>
                ))}
              </div>
              <p className="annotation">직접 리뷰가 적더라도 반복되는 사용감 이슈만 별도 태그로 묶어 제안 포인트로 전환했습니다.</p>
            </article>

            <article className="panel">
              <div className="panel-header">
                <h3>시장 시그널</h3>
                <p>Sephora 공개 시그널에서 드러나는 시장 방향</p>
              </div>
              <div className="signal-cloud">
                {analysis.marketSignals.slice(0, 5).map((signal) => (
                  <span className="cloud-chip" key={signal.label}>
                    {signal.label}
                    <strong>{signal.count}</strong>
                  </span>
                ))}
              </div>
              <p className="annotation">만족도 우세, 겨울철 보습, 레이어링 친화 같은 신호는 고객사 기획 제안의 우선순위를 잡는 데 유용합니다.</p>
            </article>

            <article className="panel">
              <div className="panel-header">
                <h3>직접 리뷰 평점 분포</h3>
                <p>시그널형 데이터는 제외하고 Amazon 직접 리뷰만 집계</p>
              </div>
              <div className="rating-distribution">
                {analysis.ratingDistribution.map((bucket) => (
                  <div className="rating-row" key={bucket.stars}>
                    <span>{bucket.stars}점</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill dark"
                        style={{
                          width: `${analysis.metrics.directReviewCount === 0 ? 0 : (bucket.count / analysis.metrics.directReviewCount) * 100}%`,
                        }}
                      />
                    </div>
                    <strong>{bucket.count}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel full-width">
              <div className="panel-header">
                <h3>채널별 차이</h3>
                <p>Amazon 직접 리뷰와 Sephora 시그널이 어떻게 다른 근거를 주는지 비교합니다.</p>
              </div>
              <div className="channel-grid">
                {analysis.channelComparisons.map((channel) => (
                  <div className="channel-card" key={channel.source}>
                    <div className="channel-top">
                      <span className={getSourceTone(channel.source)}>{channel.source}</span>
                      <strong>{channel.averageRating ? `${channel.averageRating.toFixed(1)} / 5.0` : "signal-based"}</strong>
                    </div>
                    <dl>
                      <div>
                        <dt>근거 수</dt>
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
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="section-index">Section 3</span>
            <h2>Proposal Opportunity Board</h2>
          </div>
          <p>소비자 근거를 코스맥스 마케팅 직무의 언어로 재구성해 바로 제안 가능한 카드 형태로 보여줍니다.</p>
        </div>
        <div className="opportunity-grid">
          {analysis.opportunityCards.map((card) => {
            const active = activeOpportunity?.id === card.id;

            return (
              <button
                className={active ? "opportunity-card active" : "opportunity-card"}
                key={card.id}
                onClick={() => setActiveOpportunityId(card.id)}
                type="button"
              >
                <div className="opportunity-top">
                  <span>기회 점수 {card.opportunityScore}</span>
                  <span>{card.evidenceCount}건 근거</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                <div className="opportunity-tags">
                  {card.dominantTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="opportunity-note">
                  <strong>제안 가능한 제품 콘셉트</strong>
                  <p>{card.proposalConcept}</p>
                </div>
                <div className="opportunity-note">
                  <strong>왜 코스맥스 마케팅 직무와 연결되는가</strong>
                  <p>{card.roleTie}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="section-index">Section 4</span>
            <h2>Evidence Viewer</h2>
          </div>
          <p>카드별 근거를 클릭하면 실제 출처 URL, 리뷰 인용 여부, 시그널 종류까지 함께 확인할 수 있습니다.</p>
        </div>

        {activeOpportunity ? (
          <div className="evidence-layout">
            <div className="evidence-list">
              <div className="evidence-summary">
                <span className="eyebrow">SELECTED OPPORTUNITY</span>
                <h3>{activeOpportunity.title}</h3>
                <p>{activeOpportunity.salesTalkingPoint}</p>
                <blockquote>{activeOpportunity.representativeQuote}</blockquote>
                <p className="evidence-footnote">
                  Amazon 항목은 공개 리뷰 문맥을 포트폴리오용으로 짧게 정리했고, Sephora 항목은 공개 product page signal을 그대로 구조화했습니다.
                </p>
              </div>

              {activeOpportunity.evidenceItems.map((item) => {
                const active = selectedEvidence?.id === item.id;

                return (
                  <button
                    className={active ? "evidence-item active" : "evidence-item"}
                    key={item.id}
                    onClick={() => setSelectedEvidenceId(item.id)}
                    type="button"
                  >
                    <div className="evidence-head">
                      <span className={getSourceTone(item.source)}>{item.source}</span>
                      <span>{getEvidenceKindLabel(item.evidence_kind)}</span>
                    </div>
                    <strong>{item.product_name}</strong>
                    <p>{item.review_title}</p>
                    <div className="evidence-meta">
                      <span>{item.brand}</span>
                      <span>{item.rating ? `${item.rating}점` : item.signal_label ?? "signal"}</span>
                      <span>{formatDate(item.review_date)}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="evidence-detail">
              {selectedEvidence ? (
                <EvidenceDetail card={activeOpportunity} evidence={selectedEvidence} />
              ) : (
                <div className="empty-state compact">
                  <h3>근거 항목을 선택해주세요.</h3>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-state compact">
            <h3>현재 필터 조건에서는 기회 카드가 생성되지 않습니다.</h3>
            <p>근거 타입이나 브랜드 필터를 조금 완화하면 다시 제안 시나리오가 보입니다.</p>
          </div>
        )}
      </section>

      <section className="section-card">
        <div className="section-heading">
          <div>
            <span className="section-index">Section 5</span>
            <h2>Opportunity & Proposal</h2>
          </div>
          <p>분석 결과 중 실제 고객사 제안 문장으로 연결하기 좋은 핵심 기회만 마지막에 다시 요약했습니다.</p>
        </div>

        <div className="proposal-summary-grid">
          {finalProposalCards.map((card, index) => (
            <article className="proposal-summary-card" key={`summary-${card.id}`}>
              <span className="proposal-summary-index">{`OPPORTUNITY ${String(index + 1).padStart(2, "0")}`}</span>
              <h3>{card.title}</h3>
              <p>{card.summary}</p>
              <div className="proposal-summary-note">
                <strong>제안</strong>
                <span>{card.proposalConcept}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
