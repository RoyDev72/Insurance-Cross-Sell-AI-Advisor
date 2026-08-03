export type PolicyType = 'motor' | 'health' | 'life' | 'PA' | 'critical_illness';

export interface Customer {
  id: string;
  name: string;
  age: number;
  city: string;
  phone?: string;
  existing_policies: PolicyType[];
  policy_purchase_date?: string;
  created_at?: string;
  deleted_at?: string | null;
}

export interface RecommendationResult {
  customer_id: string;
  customer_name: string;
  age: number;
  city: string;
  phone?: string;
  existing_policies: PolicyType[];
  recommended_policy: PolicyType;
  reason: string;
  rule_id: string;
  risk_level: 'High' | 'Medium' | 'Low';
  whatsapp_message: string;
  generated_at: string;
  ai_provider: string;
  execution_latency_ms: number;
}

export interface DashboardSummary {
  total_customers: number;
  policy_distribution: Record<PolicyType, number>;
  coverage_gaps_pct: Record<PolicyType, number>;
  top_recommended_policy: PolicyType;
  high_priority_leads_count: number;
}
