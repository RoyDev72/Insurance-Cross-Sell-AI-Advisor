import { Router, Request, Response } from 'express';
import { fetchAllCustomers } from '../lib/supabase.js';
import { evaluateCrossSellRules } from '../lib/recommendation-engine.js';
import { PolicyType } from '../types/index.js';

const router = Router();

// GET /api/dashboard/summary
router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const customers = await fetchAllCustomers();
    const total_customers = customers.length;

    const policy_distribution: Record<PolicyType, number> = {
      motor: 0,
      health: 0,
      life: 0,
      PA: 0,
      critical_illness: 0,
    };

    const recommendation_counts: Record<PolicyType, number> = {
      motor: 0,
      health: 0,
      life: 0,
      PA: 0,
      critical_illness: 0,
    };

    let high_priority_leads_count = 0;

    customers.forEach((c) => {
      c.existing_policies.forEach((p) => {
        if (policy_distribution[p] !== undefined) {
          policy_distribution[p]++;
        }
      });

      const result = evaluateCrossSellRules(c);
      if (recommendation_counts[result.recommended_policy] !== undefined) {
        recommendation_counts[result.recommended_policy]++;
      }
      if (result.rule_id.startsWith('R1_') || result.rule_id.startsWith('R2_')) {
        high_priority_leads_count++;
      }
    });

    const coverage_gaps_pct: Record<PolicyType, number> = {
      motor: Math.round(((total_customers - policy_distribution.motor) / (total_customers || 1)) * 100),
      health: Math.round(((total_customers - policy_distribution.health) / (total_customers || 1)) * 100),
      life: Math.round(((total_customers - policy_distribution.life) / (total_customers || 1)) * 100),
      PA: Math.round(((total_customers - policy_distribution.PA) / (total_customers || 1)) * 100),
      critical_illness: Math.round(((total_customers - policy_distribution.critical_illness) / (total_customers || 1)) * 100),
    };

    let top_recommended_policy: PolicyType = 'health';
    let maxCount = -1;
    (Object.keys(recommendation_counts) as PolicyType[]).forEach((p) => {
      if (recommendation_counts[p] > maxCount) {
        maxCount = recommendation_counts[p];
        top_recommended_policy = p;
      }
    });

    res.json({
      total_customers,
      policy_distribution,
      coverage_gaps_pct,
      top_recommended_policy,
      high_priority_leads_count,
    });
  } catch (error) {
    console.error('Error generating dashboard summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

export default router;
