
export interface PaymentMenthodResponseI{
    _id: string; 
    user: string;
    externalId: string; 
    methodType: string; 
    brand: string; 
    last4: string; 
    expMonth: number; 
    expYear: number; 
    isDefault: boolean;
}

export interface PaymentMenthodRequestI {
    user: string; 
    provider: string;
    methodType: string; 
    externalId: string; 
    brand: string; 
    last4: string; 
    expMonth: Number; 
    expYear: Number; 
    providerRaw?: Record<string, any>;
}

export interface PlanConfigI {
  aiSummaries: boolean;
  chatWithArticles: boolean;
  aiTranslation: boolean;
  writingAssistant: boolean;
  titleGeneration: boolean;
  seoAssistant: boolean;
  tagGeneration: boolean;
  advancedAnalytics: boolean;
  aiCovers: boolean;
  notesToArticle: boolean;
  newsletter: boolean;
  fullAnalytics: boolean;
  featuredProfile: boolean;
  audienceGrowthTools: boolean;
  priorityRecommendations: boolean;
  aiConsume: number;
}

export type PlanInterval = "MONTH" | "YEAR" | "WEEK" | "DAY";

export interface PlanI {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: PlanInterval;
  isActive: boolean;
  isFree: boolean;
  config: PlanConfigI;
}

export interface PaymentFlowI{
    plan: PlanI;
    method: PaymentMenthodResponseI;
}
