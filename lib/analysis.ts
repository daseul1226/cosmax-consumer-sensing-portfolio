import {
  ChannelComparison,
  ConsumerEvidence,
  EnrichedEvidence,
  FilterState,
  MarketSignalTag,
  OpportunityCard,
  PainPointTag,
  PortfolioAnalysis,
  RatingBucket,
  SentimentLabel,
  ThemeTag,
} from "@/lib/types";

const themeDictionary: Record<ThemeTag, string[]> = {
  보습: ["hydrating", "hydration", "moisture", "moisturizer", "dry skin", "barrier", "ceramide", "dewy"],
  저자극: ["gentle", "sensitive", "soothing", "barrier", "stinging", "irritation"],
  흡수력: ["absorb", "absorbing", "fast", "quick", "layering", "light", "watery"],
  향: ["smell", "scent", "fragrance", "honey"],
  사용감: ["texture", "finish", "rich", "lightweight", "comfortable", "polished", "heavy"],
  패키지: ["pump", "packaging", "bottle", "jar", "refill"],
  가성비: ["value", "price", "overpriced", "worth"],
  프리미엄감: ["premium", "luxury", "sensorial", "prestige", "elegant"],
};

const painPointDictionary: Record<PainPointTag, string[]> = {
  "건조함 우려": ["dryness", "dry", "richer follow-up", "stripped", "cold weather"],
  "향 민감도": ["smell", "scent", "fragrance", "sensory"],
  "효과 체감 약함": ["not every day", "too active", "mixed", "caution"],
  "사용감 불만": ["heavy", "sting", "stinging", "awkward", "inconvenience"],
  "패키지/리필 니즈": ["pump", "packaging", "jar", "refill"],
};

const marketSignalDictionary: Record<MarketSignalTag, string[]> = {
  "겨울철 보습": ["cold weather", "dry skin", "intense hydration", "barrier"],
  "민감 피부 적합": ["sensitive skin", "gentle", "soothing", "barrier"],
  "프리미엄 텍스처": ["smell", "sensorial", "premium", "luxury", "dewy"],
  "레이어링 친화": ["layering", "watery", "fast", "toner", "light"],
  "만족도 우세": ["satisfaction", "top review", "positive review", "customer-review signal"],
};

const positiveKeywords = ["smoother", "comfortable", "works well", "clean", "polished", "satisfaction", "approval"];
const negativeKeywords = ["sting", "stinging", "awkward", "dryness", "too active", "not every day"];

const opportunityTemplates = [
  {
    id: "barrier-sensitive",
    title: "민감 피부 장벽 보습 수요",
    summary:
      "민감 피부 적합성과 장벽 보습 신호가 동시에 반복돼, 저자극 고보습 제안이 고객사 미팅에서 설득력을 갖기 좋은 구간입니다.",
    proposalConcept: "세라마이드 기반 저자극 장벽 보습 라인",
    salesTalkingPoint:
      "민감 피부와 건성 니즈가 겹치는 구간을 겨냥해, 저자극 신뢰성과 집중 보습감을 동시에 강조하는 신제품 제안 포인트로 연결할 수 있습니다.",
    roleTie:
      "고객사 신제품 제안 단계에서 소비자 불안 요인과 선호 요인을 함께 번역해 포지셔닝 메시지를 만드는 역량을 보여줍니다.",
    match: (evidence: EnrichedEvidence) =>
      evidence.theme_tags.includes("보습") &&
      (evidence.theme_tags.includes("저자극") || evidence.market_signal_tags.includes("민감 피부 적합")),
  },
  {
    id: "premium-sensorial",
    title: "프리미엄 텍스처와 향 경험 강화",
    summary:
      "Sephora 시그널에서 향과 만족도가 반복되고 있어, 효능 설명만이 아니라 감각적 사용 경험까지 설계하는 제안이 유효합니다.",
    proposalConcept: "향 경험을 살린 프리미엄 보습 크림 또는 슬리핑 포맷",
    salesTalkingPoint:
      "프리미엄감은 성분만으로 형성되지 않기 때문에, 향과 발림성까지 포함한 감각 설계형 제안을 고객사별 차별 포인트로 활용할 수 있습니다.",
    roleTie:
      "기존 고객사 육성 과정에서 단가 경쟁이 아니라 감각 경험과 카테고리 업그레이드로 제안 범위를 넓히는 관점을 보여줍니다.",
    match: (evidence: EnrichedEvidence) =>
      evidence.theme_tags.includes("향") ||
      evidence.theme_tags.includes("프리미엄감") ||
      evidence.market_signal_tags.includes("프리미엄 텍스처"),
  },
  {
    id: "layering-absorption",
    title: "레이어링 친화 제형 기회",
    summary:
      "무겁지 않게 레이어링되는 보습 포맷과 빠른 흡수감에 대한 선호가 보이므로, 토너-에센스-크림 중간 제형 제안 여지가 있습니다.",
    proposalConcept: "빠른 흡수의 밀키 토너 또는 젤-크림 하이브리드",
    salesTalkingPoint:
      "건성 대응을 유지하면서도 답답함을 줄인 제형은 미국 이커머스와 세포라형 채널 모두에서 설득 포인트가 될 수 있습니다.",
    roleTie:
      "제품 제안 이후 발주와 납기 협의 단계에서도 SKU 확장 논리를 만들기 쉬운 실무형 기회 영역입니다.",
    match: (evidence: EnrichedEvidence) =>
      evidence.theme_tags.includes("흡수력") ||
      evidence.market_signal_tags.includes("레이어링 친화") ||
      evidence.pain_point_tags.includes("사용감 불만"),
  },
  {
    id: "winter-moisture",
    title: "겨울철 집중 보습 SKU 확장",
    summary:
      "Cold weather와 dry skin 시그널이 반복되어, 계절성 집중 보습 SKU를 별도로 제안할 근거가 충분합니다.",
    proposalConcept: "윈터 배리어 크림 또는 집중 보습 밤",
    salesTalkingPoint:
      "계절성 SKU는 기존 고객사와의 매출 확장, 재발주 포인트, 프로모션 메시지 설계까지 함께 이야기할 수 있는 기회입니다.",
    roleTie:
      "영업과 납기관리 관점에서 시즌성 수요를 근거 있게 설명하면 발주 타이밍과 제안 우선순위 조율에 강점이 생깁니다.",
    match: (evidence: EnrichedEvidence) =>
      evidence.market_signal_tags.includes("겨울철 보습") || evidence.pain_point_tags.includes("건조함 우려"),
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

function includesKeyword(text: string, keyword: string) {
  return text.includes(normalizeText(keyword).trim());
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function countMap(items: string[]) {
  const counts = new Map<string, number>();

  items.forEach((item) => {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  });

  return counts;
}

function rankLabels(items: string[], recentItems: string[]) {
  const counts = countMap(items);
  const recentCounts = countMap(recentItems);

  return [...counts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      weight: count * 10 + (recentCounts.get(label) ?? 0) * 4,
    }))
    .sort((left, right) => right.weight - left.weight);
}

function extractLabels<T extends string>(text: string, dictionary: Record<T, string[]>) {
  return (Object.entries(dictionary) as Array<[T, string[]]>).reduce<{ labels: T[]; matchedKeywords: string[] }>(
    (accumulator, [label, keywords]) => {
      const matched = keywords.filter((keyword) => includesKeyword(text, keyword));

      if (matched.length > 0) {
        accumulator.labels.push(label);
        accumulator.matchedKeywords.push(...matched);
      }

      return accumulator;
    },
    { labels: [], matchedKeywords: [] },
  );
}

function determineSentiment(evidence: ConsumerEvidence, text: string): SentimentLabel {
  if (evidence.evidence_kind === "review_signal") {
    return "신호";
  }

  const positiveHits = positiveKeywords.filter((keyword) => includesKeyword(text, keyword)).length;
  const negativeHits = negativeKeywords.filter((keyword) => includesKeyword(text, keyword)).length;
  const ratingScore = (evidence.rating ?? 3) - 3;
  const score = ratingScore + positiveHits * 0.6 - negativeHits * 0.8;

  if (score >= 1.25) {
    return "긍정";
  }

  if (score <= -0.6) {
    return "부정";
  }

  return "혼합";
}

function buildCorpus(evidence: ConsumerEvidence) {
  return normalizeText(
    [
      evidence.brand,
      evidence.product_name,
      evidence.category,
      evidence.review_title,
      evidence.review_text,
      evidence.review_summary,
      evidence.skin_concern,
      evidence.price_band,
      evidence.signal_label ?? "",
      evidence.source_signal_tags.join(" "),
    ].join(" "),
  );
}

function enrichEvidence(evidence: ConsumerEvidence): EnrichedEvidence {
  const corpus = buildCorpus(evidence);
  const themeExtraction = extractLabels(corpus, themeDictionary);
  const painExtraction = extractLabels(corpus, painPointDictionary);
  const marketExtraction = extractLabels(corpus, marketSignalDictionary);
  const opportunityScore = Math.min(
    99,
    Math.round(
      28 +
        themeExtraction.labels.length * 5 +
        painExtraction.labels.length * 7 +
        marketExtraction.labels.length * 9 +
        (evidence.evidence_kind === "review_signal" ? 3 : 0) +
        ((evidence.review_count ?? 0) >= 2000 ? 6 : 0),
    ),
  );

  return {
    ...evidence,
    sentiment_label: determineSentiment(evidence, corpus),
    theme_tags: themeExtraction.labels,
    pain_point_tags: painExtraction.labels,
    market_signal_tags: marketExtraction.labels,
    opportunity_score: opportunityScore,
    matched_keywords: [...themeExtraction.matchedKeywords, ...painExtraction.matchedKeywords, ...marketExtraction.matchedKeywords],
  };
}

function buildRatingDistribution(items: EnrichedEvidence[]): RatingBucket[] {
  const ratedItems = items.filter((item) => item.rating !== null);

  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: ratedItems.filter((item) => item.rating === stars).length,
  }));
}

function buildChannelComparisons(items: EnrichedEvidence[]): ChannelComparison[] {
  return (["Amazon", "Sephora"] as const)
    .map((source) => {
      const channelItems = items.filter((item) => item.source === source);

      if (channelItems.length === 0) {
        return null;
      }

      const recentItems = channelItems.filter(
        (item) => new Date(item.captured_at).getTime() >= new Date("2026-01-01").getTime(),
      );
      const ratedItems = channelItems.filter((item) => item.rating !== null);
      const themeSignals = rankLabels(
        channelItems.flatMap((item) => item.theme_tags),
        recentItems.flatMap((item) => item.theme_tags),
      );
      const painSignals = rankLabels(
        channelItems.flatMap((item) => item.pain_point_tags),
        recentItems.flatMap((item) => item.pain_point_tags),
      );
      const marketSignals = rankLabels(
        channelItems.flatMap((item) => item.market_signal_tags),
        recentItems.flatMap((item) => item.market_signal_tags),
      );

      return {
        source,
        evidenceCount: channelItems.length,
        directReviewCount: channelItems.filter((item) => item.evidence_kind === "review_quote").length,
        signalCount: channelItems.filter((item) => item.evidence_kind === "review_signal").length,
        averageRating: ratedItems.length > 0 ? average(ratedItems.map((item) => item.rating ?? 0)) : null,
        topTheme: themeSignals[0]?.label ?? "보습",
        topPainPoint: painSignals[0]?.label ?? "데이터 없음",
        topMarketSignal: marketSignals[0]?.label ?? "만족도 우세",
        insight:
          source === "Amazon"
            ? "직접 리뷰에서는 사용감과 자극 우려가 함께 보이므로 제형 개선 포인트를 제안 언어로 바꾸기 좋습니다."
            : "Sephora 공개 시그널은 만족도와 건성 대응이 강해서 프리미엄 보습 카테고리 제안 논리로 쓰기 좋습니다.",
      };
    })
    .filter((item): item is ChannelComparison => item !== null);
}

function buildOpportunityCards(items: EnrichedEvidence[]): OpportunityCard[] {
  return opportunityTemplates
    .map((template) => {
      const evidenceItems = items.filter(template.match);

      if (evidenceItems.length < 2) {
        return null;
      }

      const representative =
        [...evidenceItems].sort((left, right) => right.opportunity_score - left.opportunity_score)[0] ?? evidenceItems[0];
      const dominantTags = rankLabels(
        evidenceItems.flatMap((item) => [...item.theme_tags, ...item.pain_point_tags, ...item.market_signal_tags]),
        evidenceItems.flatMap((item) => [...item.theme_tags, ...item.pain_point_tags, ...item.market_signal_tags]),
      )
        .slice(0, 3)
        .map((item) => item.label);
      const sourceMix = [...new Set(evidenceItems.map((item) => item.source))];
      const opportunityScore = Math.min(
        99,
        Math.round(
          28 +
            evidenceItems.length * 2 +
            sourceMix.length * 8 +
            average(evidenceItems.map((item) => item.market_signal_tags.length)) * 9,
        ),
      );

      return {
        id: template.id,
        title: template.title,
        summary: template.summary,
        proposalConcept: template.proposalConcept,
        salesTalkingPoint: template.salesTalkingPoint,
        roleTie: template.roleTie,
        evidenceCount: evidenceItems.length,
        opportunityScore,
        representativeQuote: representative.quote_excerpt ?? representative.review_summary,
        dominantTags,
        evidenceItems,
        sourceMix,
      };
    })
    .filter((item): item is OpportunityCard => item !== null)
    .sort((left, right) => right.opportunityScore - left.opportunityScore);
}

export function analyzePortfolioData(evidenceItems: ConsumerEvidence[]): PortfolioAnalysis {
  const enrichedEvidence = evidenceItems.map(enrichEvidence);
  const recentEvidence = enrichedEvidence.filter(
    (item) => new Date(item.captured_at).getTime() >= new Date("2026-01-01").getTime(),
  );
  const ratedEvidence = enrichedEvidence.filter((item) => item.rating !== null);
  const opportunityCards = buildOpportunityCards(enrichedEvidence);
  const themeSignals = rankLabels(
    enrichedEvidence.flatMap((item) => item.theme_tags),
    recentEvidence.flatMap((item) => item.theme_tags),
  );
  const painSignals = rankLabels(
    enrichedEvidence.flatMap((item) => item.pain_point_tags),
    recentEvidence.flatMap((item) => item.pain_point_tags),
  );
  const marketSignals = rankLabels(
    enrichedEvidence.flatMap((item) => item.market_signal_tags),
    recentEvidence.flatMap((item) => item.market_signal_tags),
  );

  return {
    enrichedEvidence,
    metrics: {
      totalEvidence: enrichedEvidence.length,
      directReviewCount: enrichedEvidence.filter((item) => item.evidence_kind === "review_quote").length,
      signalCount: enrichedEvidence.filter((item) => item.evidence_kind === "review_signal").length,
      averageRating: ratedEvidence.length > 0 ? average(ratedEvidence.map((item) => item.rating ?? 0)) : 0,
      opportunityCount: opportunityCards.length,
    },
    themeSignals,
    painSignals,
    marketSignals,
    ratingDistribution: buildRatingDistribution(enrichedEvidence),
    channelComparisons: buildChannelComparisons(enrichedEvidence),
    opportunityCards,
    keywordOptions: [...new Set([...themeSignals, ...painSignals, ...marketSignals].map((signal) => signal.label))],
  };
}

export function filterEvidence(evidenceItems: ConsumerEvidence[], filters: FilterState) {
  return evidenceItems.filter((item) => {
    const enriched = enrichEvidence(item);
    const searchText = buildCorpus(item);
    const labelCorpus = [...enriched.theme_tags, ...enriched.pain_point_tags, ...enriched.market_signal_tags].join(" ");

    if (filters.source !== "all" && item.source !== filters.source) {
      return false;
    }

    if (filters.evidenceKind !== "all" && item.evidence_kind !== filters.evidenceKind) {
      return false;
    }

    if (filters.brand !== "all" && item.brand !== filters.brand) {
      return false;
    }

    if (filters.category !== "all" && item.category !== filters.category) {
      return false;
    }

    if (filters.ratingBand === "high" && (item.rating === null || item.rating < 4)) {
      return false;
    }

    if (filters.ratingBand === "mixed" && item.rating !== 3) {
      return false;
    }

    if (filters.ratingBand === "low" && (item.rating === null || item.rating > 2)) {
      return false;
    }

    if (filters.ratingBand === "signal" && item.evidence_kind !== "review_signal") {
      return false;
    }

    if (filters.keyword && !searchText.includes(normalizeText(filters.keyword)) && !labelCorpus.includes(filters.keyword)) {
      return false;
    }

    if (filters.search && !searchText.includes(normalizeText(filters.search))) {
      return false;
    }

    return true;
  });
}

export function getFilterOptions(evidenceItems: ConsumerEvidence[]) {
  return {
    brands: [...new Set(evidenceItems.map((item) => item.brand))].sort(),
    categories: [...new Set(evidenceItems.map((item) => item.category))].sort(),
  };
}
