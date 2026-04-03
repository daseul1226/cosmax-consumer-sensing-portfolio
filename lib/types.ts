export type ReviewSource = "Amazon" | "Sephora";
export type EvidenceKind = "review_quote" | "review_signal";

export type ThemeTag =
  | "보습"
  | "저자극"
  | "흡수력"
  | "향"
  | "사용감"
  | "패키지"
  | "가성비"
  | "프리미엄감";

export type PainPointTag =
  | "건조함 우려"
  | "향 민감도"
  | "효과 체감 약함"
  | "사용감 불만"
  | "패키지/리필 니즈";

export type MarketSignalTag =
  | "겨울철 보습"
  | "민감 피부 적합"
  | "프리미엄 텍스처"
  | "레이어링 친화"
  | "만족도 우세";

export type SentimentLabel = "긍정" | "혼합" | "부정" | "신호";

export interface ConsumerEvidence {
  id: string;
  source: ReviewSource;
  evidence_kind: EvidenceKind;
  brand: string;
  product_name: string;
  category: string;
  rating: number | null;
  review_title: string;
  review_text: string;
  review_summary: string;
  review_date: string | null;
  captured_at: string;
  country: string;
  price_band: string;
  skin_concern: string;
  source_url: string;
  source_domain: string;
  review_count: number | null;
  source_signal_tags: string[];
  signal_label: string | null;
  reviewer_alias: string | null;
  verified_purchase: boolean | null;
  quote_excerpt: string | null;
}

export interface EnrichedEvidence extends ConsumerEvidence {
  sentiment_label: SentimentLabel;
  theme_tags: ThemeTag[];
  pain_point_tags: PainPointTag[];
  market_signal_tags: MarketSignalTag[];
  opportunity_score: number;
  matched_keywords: string[];
}

export interface TagCount {
  label: string;
  count: number;
  weight: number;
}

export interface RatingBucket {
  stars: number;
  count: number;
}

export interface ChannelComparison {
  source: ReviewSource;
  evidenceCount: number;
  directReviewCount: number;
  signalCount: number;
  averageRating: number | null;
  topTheme: string;
  topPainPoint: string;
  topMarketSignal: string;
  insight: string;
}

export interface OpportunityCard {
  id: string;
  title: string;
  summary: string;
  proposalConcept: string;
  salesTalkingPoint: string;
  roleTie: string;
  evidenceCount: number;
  opportunityScore: number;
  representativeQuote: string;
  dominantTags: string[];
  evidenceItems: EnrichedEvidence[];
  sourceMix: ReviewSource[];
}

export interface PortfolioAnalysis {
  enrichedEvidence: EnrichedEvidence[];
  metrics: {
    totalEvidence: number;
    directReviewCount: number;
    signalCount: number;
    averageRating: number;
    opportunityCount: number;
  };
  themeSignals: TagCount[];
  painSignals: TagCount[];
  marketSignals: TagCount[];
  ratingDistribution: RatingBucket[];
  channelComparisons: ChannelComparison[];
  opportunityCards: OpportunityCard[];
  keywordOptions: string[];
}

export interface FilterState {
  source: string;
  evidenceKind: string;
  brand: string;
  category: string;
  ratingBand: string;
  keyword: string;
  search: string;
}
