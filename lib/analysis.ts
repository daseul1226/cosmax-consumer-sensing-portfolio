import {
  ChannelComparison,
  EnrichedReview,
  FilterState,
  OpportunityCard,
  PainPointTag,
  PortfolioAnalysis,
  PremiumSignalTag,
  RatingBucket,
  ReviewRecord,
  SentimentLabel,
  ThemeTag,
} from "@/lib/types";

const themeDictionary: Record<ThemeTag, string[]> = {
  보습: [
    "hydrating",
    "hydration",
    "moisture",
    "moisturizing",
    "plump",
    "dewy",
    "dry patches",
    "barrier",
    "comforts dry",
    "nourishing",
  ],
  저자극: [
    "gentle",
    "soothing",
    "calm",
    "sensitive",
    "redness",
    "fragrance-free",
    "irritation",
    "stinging",
    "eczema",
    "reactive skin",
  ],
  흡수력: [
    "absorbs",
    "absorb",
    "absorbed",
    "sinks in",
    "quick",
    "fast",
    "greasy",
    "sticky",
    "tacky",
    "pilling",
  ],
  향: ["scent", "fragrance", "smell", "odor", "perfume"],
  사용감: [
    "texture",
    "finish",
    "layer",
    "layering",
    "lightweight",
    "rich",
    "silky",
    "watery",
    "creamy",
    "bouncy",
  ],
  패키지: ["pump", "jar", "packaging", "bottle", "cap", "tube", "refill", "travel", "spatula"],
  가성비: ["worth", "price", "expensive", "value", "lasts long", "tiny", "cost", "overpriced"],
  프리미엄감: [
    "luxurious",
    "luxury",
    "premium",
    "spa-like",
    "elegant",
    "refined",
    "beautiful bottle",
    "high-end",
    "display-worthy",
  ],
};

const painPointDictionary: Record<PainPointTag, string[]> = {
  "흡수감 불만": ["sticky", "greasy", "tacky", "pilling", "sits on top", "won't absorb", "too heavy"],
  "자극 우려": ["irritation", "stinging", "burning", "breakout", "redness", "rash", "fragrance was too much"],
  "패키지 불편": ["pump stopped", "jar", "messy", "leaks", "no refill", "spatula", "travel cap", "bottle cracked"],
  "가성비 부담": ["overpriced", "pricey", "too expensive", "small for the price", "tiny jar", "costly"],
  "향 호불호": ["strong scent", "fragrance", "perfume", "smell"],
};

const premiumDictionary: Record<PremiumSignalTag, string[]> = {
  "스파 같은 경험": ["spa-like", "luxurious", "luxury", "high-end"],
  "정제된 텍스처": ["silky", "velvety", "elegant", "refined", "plush"],
  "선물하기 좋은 패키지": ["beautiful bottle", "glass bottle", "premium packaging", "display-worthy", "looks expensive"],
};

const positiveKeywords = [
  "love",
  "glowy",
  "soft",
  "calming",
  "effective",
  "beautiful",
  "worth it",
  "repurchase",
  "favorite",
  "comfortable",
];

const negativeKeywords = [
  "sticky",
  "greasy",
  "overpriced",
  "messy",
  "broke me out",
  "pilling",
  "irritation",
  "stinging",
  "strong scent",
];

const opportunityTemplates = [
  {
    id: "sensitive-aging",
    title: "저자극 안티에이징 수요 확대",
    summary:
      "민감성 피부도 부담 없이 사용할 수 있으면서, 보습과 탄력감을 동시에 주는 프리미엄 케어 수요가 반복적으로 보입니다.",
    proposalConcept: "세라마이드·펩타이드 기반 저자극 퍼밍 크림",
    salesTalkingPoint:
      "기존 고객사에는 민감성 안티에이징 라인 확장 제안, 신규 고객사에는 프리미엄 스킨케어 진입형 콘셉트로 연결할 수 있습니다.",
    roleTie:
      "소비자 불안을 줄이는 효능 포인트를 계약 제안 언어로 번역해, 고객사 니즈 대응과 제품 개발 커뮤니케이션에 활용할 수 있습니다.",
    match: (review: EnrichedReview) =>
      (review.theme_tags.includes("저자극") || review.skin_concern.toLowerCase().includes("sensitivity")) &&
      (review.skin_concern.toLowerCase().includes("anti-aging") ||
        review.theme_tags.includes("보습") ||
        review.premium_signal_tags.length > 0),
  },
  {
    id: "absorption-fix",
    title: "흡수감 개선 니즈",
    summary:
      "효능은 만족하지만 끈적임, 밀림, 무거운 잔여감 때문에 재구매를 망설이는 패턴이 확인됩니다.",
    proposalConcept: "퀵-흡수 세럼·크림 제형 리뉴얼",
    salesTalkingPoint:
      "기존 제품의 효능은 유지하면서 사용감 이슈를 보완한 리뉴얼 제안으로 고객사 재발주와 리뉴얼 논의를 유도할 수 있습니다.",
    roleTie:
      "반복 불만을 명확한 개선 포인트로 정리하면, 고객 대응과 납기 전 샘플 피드백 정리에 바로 활용할 수 있습니다.",
    match: (review: EnrichedReview) =>
      review.pain_point_tags.includes("흡수감 불만") ||
      review.review_text.toLowerCase().includes("sticky") ||
      review.review_text.toLowerCase().includes("pilling"),
  },
  {
    id: "premium-texture",
    title: "프리미엄 텍스처 선호",
    summary:
      "단순 기능보다 실키함, 우아한 마무리감, 스파 같은 경험을 중시하는 프리미엄 감성 키워드가 강하게 나타납니다.",
    proposalConcept: "감각형 하이엔드 텍스처 세럼·크림",
    salesTalkingPoint:
      "고급화 전략을 원하는 고객사에는 사용감 차별화와 패키지 감성까지 묶은 프리미엄 포맷 제안을 할 수 있습니다.",
    roleTie:
      "가격이 아니라 감각 경험으로 제품을 설명하는 언어를 확보해, 고객사 육성용 제안서의 설득력을 높일 수 있습니다.",
    match: (review: EnrichedReview) =>
      review.theme_tags.includes("프리미엄감") ||
      review.premium_signal_tags.length > 0 ||
      review.review_text.toLowerCase().includes("silky"),
  },
  {
    id: "refill-packaging",
    title: "리필·대용량 패키지 기회",
    summary:
      "패키지 편의성과 용량 만족도에 대한 언급이 반복되며, 사용 경험 유지와 실용성 개선을 동시에 원하는 수요가 보입니다.",
    proposalConcept: "리필형 또는 대용량 보습 라인",
    salesTalkingPoint:
      "재구매가 많은 보습 카테고리 고객사에는 리필 구조나 대용량 SKU 확장으로 객단가와 충성도를 동시에 높이는 제안을 할 수 있습니다.",
    roleTie:
      "패키지·발주 단위·라인 확장 가능성을 함께 해석하면, 영업과 납기관리 관점 모두에서 실무적인 제안 포인트가 됩니다.",
    match: (review: EnrichedReview) =>
      review.theme_tags.includes("패키지") ||
      review.pain_point_tags.includes("패키지 불편") ||
      review.review_text.toLowerCase().includes("refill") ||
      review.review_text.toLowerCase().includes("small for the price"),
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

function includesKeyword(text: string, keyword: string) {
  return text.includes(normalizeText(keyword).trim());
}

function extractLabels<T extends string>(text: string, dictionary: Record<T, string[]>) {
  return (Object.entries(dictionary) as Array<[T, string[]]>).reduce<{ labels: T[]; matchedKeywords: string[] }>(
    (accumulator, [label, keywords]) => {
      const matched = keywords.filter((keyword) => includesKeyword(text, keyword));

      if (matched.length > 0) {
        accumulator.labels.push(label as T);
        accumulator.matchedKeywords.push(...matched);
      }

      return accumulator;
    },
    { labels: [], matchedKeywords: [] },
  );
}

function determineSentiment(rating: number, text: string): SentimentLabel {
  const positiveHits = positiveKeywords.filter((keyword) => includesKeyword(text, keyword)).length;
  const negativeHits = negativeKeywords.filter((keyword) => includesKeyword(text, keyword)).length;
  const score = rating - 3 + positiveHits * 0.5 - negativeHits * 0.8;

  if (score >= 1.25) {
    return "긍정";
  }

  if (score <= -0.75) {
    return "부정";
  }

  return "혼합";
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatCountMap(items: string[]) {
  const map = new Map<string, number>();

  items.forEach((item) => {
    map.set(item, (map.get(item) ?? 0) + 1);
  });

  return [...map.entries()];
}

function rankLabels(items: string[], recentItems: string[]) {
  const counts = formatCountMap(items);
  const recentCounts = new Map<string, number>(formatCountMap(recentItems));

  return counts
    .map(([label, count]) => ({
      label,
      count,
      weight: count * 10 + (recentCounts.get(label) ?? 0) * 4,
    }))
    .sort((left, right) => right.weight - left.weight);
}

function quoteExcerpt(text: string) {
  return text.length > 150 ? `${text.slice(0, 147)}...` : text;
}

function enrichReview(review: ReviewRecord): EnrichedReview {
  const combinedText = normalizeText(`${review.review_title} ${review.review_text}`);
  const themeExtraction = extractLabels(combinedText, themeDictionary);
  const painExtraction = extractLabels(combinedText, painPointDictionary);
  const premiumExtraction = extractLabels(combinedText, premiumDictionary);
  const sentiment = determineSentiment(review.rating, combinedText);
  const opportunityScore = Math.min(
    98,
    Math.round(
      24 +
        themeExtraction.labels.length * 8 +
        painExtraction.labels.length * 15 +
        premiumExtraction.labels.length * 12 +
        (review.rating <= 3 ? 12 : 0),
    ),
  );

  return {
    ...review,
    sentiment_label: sentiment,
    theme_tags: themeExtraction.labels,
    pain_point_tags: painExtraction.labels,
    premium_signal_tags: premiumExtraction.labels,
    opportunity_score: opportunityScore,
    matched_keywords: [...themeExtraction.matchedKeywords, ...painExtraction.matchedKeywords, ...premiumExtraction.matchedKeywords],
  };
}

function buildRatingDistribution(reviews: EnrichedReview[]): RatingBucket[] {
  return [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));
}

function buildChannelComparisons(reviews: EnrichedReview[]): ChannelComparison[] {
  return ["Amazon", "Sephora"]
    .map((source) => {
      const channelReviews = reviews.filter((review) => review.source === source);

      if (channelReviews.length === 0) {
        return null;
      }

      const topTheme = rankLabels(
        channelReviews.flatMap((review) => review.theme_tags),
        channelReviews
          .filter((review) => new Date(review.review_date) >= new Date("2025-11-01"))
          .flatMap((review) => review.theme_tags),
      )[0]?.label;

      const topPain = rankLabels(
        channelReviews.flatMap((review) => review.pain_point_tags),
        channelReviews.flatMap((review) => review.pain_point_tags),
      )[0]?.label;

      const premiumShare =
        channelReviews.filter((review) => review.premium_signal_tags.length > 0).length / channelReviews.length;

      return {
        source: source as ChannelComparison["source"],
        reviewCount: channelReviews.length,
        averageRating: average(channelReviews.map((review) => review.rating)),
        topTheme: topTheme ?? "보습",
        topPainPoint: topPain ?? "가성비 부담",
        premiumShare,
        insight:
          source === "Amazon"
            ? "실용성과 흡수감 평가가 더 많이 언급돼, 리뉴얼 제안형 영업 메시지에 적합합니다."
            : "감각 경험과 프리미엄 표현이 강해, 고급화 포지셔닝 제안에 유리합니다.",
      };
    })
    .filter((item): item is ChannelComparison => item !== null);
}

function buildOpportunityCards(reviews: EnrichedReview[]): OpportunityCard[] {
  return opportunityTemplates
    .map((template) => {
      const evidenceReviews = reviews.filter(template.match);

      if (evidenceReviews.length === 0) {
        return null;
      }

      const evidenceCount = evidenceReviews.length;
      const sourceMix = [...new Set(evidenceReviews.map((review) => review.source))];
      const negativeWeight = average(evidenceReviews.map((review) => review.pain_point_tags.length));
      const premiumWeight = average(evidenceReviews.map((review) => review.premium_signal_tags.length));
      const opportunityScore = Math.min(
        99,
        Math.round(34 + evidenceCount * 12 + sourceMix.length * 8 + negativeWeight * 9 + premiumWeight * 10),
      );
      const representativeReview =
        [...evidenceReviews].sort(
          (left, right) =>
            right.premium_signal_tags.length +
              right.pain_point_tags.length +
              right.theme_tags.length -
            (left.premium_signal_tags.length + left.pain_point_tags.length + left.theme_tags.length),
        )[0] ?? evidenceReviews[0];

      const dominantTags = rankLabels(
        evidenceReviews.flatMap((review) => [...review.theme_tags, ...review.pain_point_tags, ...review.premium_signal_tags]),
        evidenceReviews.flatMap((review) => [...review.theme_tags, ...review.pain_point_tags, ...review.premium_signal_tags]),
      )
        .slice(0, 3)
        .map((item) => item.label);

      return {
        id: template.id,
        title: template.title,
        summary: template.summary,
        proposalConcept: template.proposalConcept,
        salesTalkingPoint: template.salesTalkingPoint,
        roleTie: template.roleTie,
        evidenceCount,
        opportunityScore,
        representativeQuote: quoteExcerpt(representativeReview.review_text),
        dominantTags,
        evidenceReviews,
        sourceMix,
      };
    })
    .filter((item): item is OpportunityCard => item !== null)
    .sort((left, right) => right.opportunityScore - left.opportunityScore);
}

export function analyzePortfolioData(reviews: ReviewRecord[]): PortfolioAnalysis {
  const enrichedReviews = reviews.map(enrichReview);
  const recentReviews = enrichedReviews.filter((review) => new Date(review.review_date) >= new Date("2025-11-01"));
  const themeSignals = rankLabels(
    enrichedReviews.flatMap((review) => review.theme_tags),
    recentReviews.flatMap((review) => review.theme_tags),
  );
  const painSignals = rankLabels(
    enrichedReviews.flatMap((review) => review.pain_point_tags),
    recentReviews.flatMap((review) => review.pain_point_tags),
  );
  const premiumSignals = rankLabels(
    enrichedReviews.flatMap((review) => review.premium_signal_tags),
    recentReviews.flatMap((review) => review.premium_signal_tags),
  );
  const opportunityCards = buildOpportunityCards(enrichedReviews);

  return {
    enrichedReviews,
    metrics: {
      totalReviews: enrichedReviews.length,
      averageRating: average(enrichedReviews.map((review) => review.rating)),
      premiumShare:
        enrichedReviews.length === 0
          ? 0
          : enrichedReviews.filter((review) => review.premium_signal_tags.length > 0).length / enrichedReviews.length,
      repeatedIssueShare:
        enrichedReviews.length === 0
          ? 0
          : enrichedReviews.filter((review) => review.pain_point_tags.length > 0).length / enrichedReviews.length,
      opportunityCount: opportunityCards.length,
    },
    themeSignals,
    painSignals,
    premiumSignals,
    ratingDistribution: buildRatingDistribution(enrichedReviews),
    channelComparisons: buildChannelComparisons(enrichedReviews),
    opportunityCards,
    keywordOptions: [...new Set([...themeSignals, ...painSignals, ...premiumSignals].map((signal) => signal.label))],
  };
}

export function filterReviews(reviews: ReviewRecord[], filters: FilterState) {
  return reviews.filter((review) => {
    const enriched = enrichReview(review);
    const searchText = normalizeText(`${review.brand} ${review.product_name} ${review.review_title} ${review.review_text}`);
    const keywordCorpus = normalizeText(
      `${review.review_title} ${review.review_text} ${review.skin_concern} ${review.category} ${review.price_band}`,
    );
    const labelCorpus = [...enriched.theme_tags, ...enriched.pain_point_tags, ...enriched.premium_signal_tags].join(" ");

    if (filters.source !== "all" && review.source !== filters.source) {
      return false;
    }

    if (filters.brand !== "all" && review.brand !== filters.brand) {
      return false;
    }

    if (filters.category !== "all" && review.category !== filters.category) {
      return false;
    }

    if (filters.ratingBand === "high" && review.rating < 4) {
      return false;
    }

    if (filters.ratingBand === "mixed" && review.rating !== 3) {
      return false;
    }

    if (filters.ratingBand === "low" && review.rating > 2) {
      return false;
    }

    if (filters.keyword && !keywordCorpus.includes(filters.keyword.toLowerCase()) && !labelCorpus.includes(filters.keyword)) {
      return false;
    }

    if (filters.search && !searchText.includes(filters.search.toLowerCase())) {
      return false;
    }

    return true;
  });
}

export function getFilterOptions(reviews: ReviewRecord[]) {
  return {
    brands: [...new Set(reviews.map((review) => review.brand))].sort(),
    categories: [...new Set(reviews.map((review) => review.category))].sort(),
  };
}
