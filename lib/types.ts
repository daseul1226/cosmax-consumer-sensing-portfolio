export type ReviewSource = "Amazon" | "Sephora";
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
  | "흡수감 불만"
  | "자극 우려"
  | "패키지 불편"
  | "가성비 부담"
  | "향 호불호";
export type PremiumSignalTag =
  | "스파 같은 경험"
  | "정제된 텍스처"
  | "선물하기 좋은 패키지";
export type SentimentLabel = "긍정" | "혼합" | "부정";

export interface ReviewRecord {
  source: ReviewSource;
  brand: string;
  product_name: string;
  category: string;
  rating: number;
  review_title: string;
  review_text: string;
  review_date: string;
  country: string;
  price_band: string;
  skin_concern: string;
}

export interface EnrichedReview extends ReviewRecord {
  sentiment_label: SentimentLabel;
  theme_tags: ThemeTag[];
  pain_point_tags: PainPointTag[];
  premium_signal_tags: PremiumSignalTag[];
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
  reviewCount: number;
  averageRating: number;
  topTheme: string;
  topPainPoint: string;
  premiumShare: number;
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
  evidenceReviews: EnrichedReview[];
  sourceMix: ReviewSource[];
}

export interface PortfolioAnalysis {
  enrichedReviews: EnrichedReview[];
  metrics: {
    totalReviews: number;
    averageRating: number;
    premiumShare: number;
    repeatedIssueShare: number;
    opportunityCount: number;
  };
  themeSignals: TagCount[];
  painSignals: TagCount[];
  premiumSignals: TagCount[];
  ratingDistribution: RatingBucket[];
  channelComparisons: ChannelComparison[];
  opportunityCards: OpportunityCard[];
  keywordOptions: string[];
}

export interface FilterState {
  source: string;
  brand: string;
  category: string;
  ratingBand: string;
  keyword: string;
  search: string;
}
