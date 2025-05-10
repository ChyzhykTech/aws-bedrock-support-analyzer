export interface Query {
  text: string;
  user_id?: string;
  source?: string;
}

export interface AnalysisResult {
  query_id: string;
  text: string;
  intent: string;
  urgency: string;
  tone: string;
  category: string;
  confidence: number;
  timestamp: string;
  user_id?: string;
  source?: string;
}

export interface Stats {
  total_queries: number;
  categories: Record<string, number>;
  urgency_levels: Record<string, number>;
  tones: Record<string, number>;
} 