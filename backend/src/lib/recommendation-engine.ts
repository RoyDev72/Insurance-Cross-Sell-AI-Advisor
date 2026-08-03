import { Customer, PolicyType } from '../types/index.js';

export interface EngineResult {
  recommended_policy: PolicyType;
  reason: string;
  rule_id: string;
  risk_level: 'High' | 'Medium' | 'Low';
}

export function evaluateCrossSellRules(customer: Customer): EngineResult {
  const policies = new Set<PolicyType>(customer.existing_policies || []);

  if (policies.has('motor') && !policies.has('health')) {
    return {
      rule_id: 'R1_MOTOR_NO_HEALTH',
      recommended_policy: 'health',
      risk_level: 'High',
      reason: 'Has active motor coverage but lacks essential health protection against unexpected hospitalizations.',
    };
  }

  if ((policies.has('health') || policies.has('motor')) && !policies.has('life') && customer.age >= 25) {
    return {
      rule_id: 'R2_MISSING_LIFE_MATURE',
      recommended_policy: 'life',
      risk_level: 'High',
      reason: `At age ${customer.age}, customer has vehicle/health policies but lacks term life financial security for family dependents.`,
    };
  }

  if (policies.has('health') && policies.has('motor') && !policies.has('PA')) {
    return {
      rule_id: 'R3_HEALTH_MOTOR_NO_PA',
      recommended_policy: 'PA',
      risk_level: 'Medium',
      reason: 'Has comprehensive health & vehicle policies, but lacks personal accident rider cover for accidental disability.',
    };
  }

  if (policies.has('health') && policies.has('life') && !policies.has('critical_illness')) {
    return {
      rule_id: 'R4_MISSING_CRITICAL_ILLNESS',
      recommended_policy: 'critical_illness',
      risk_level: 'Medium',
      reason: `At age ${customer.age}, customer has life and health insurance but lacks lump-sum payout protection for critical illness diagnosis.`,
    };
  }

  if (!policies.has('health')) {
    return {
      rule_id: 'R5_NO_HEALTH_PRIMARY',
      recommended_policy: 'health',
      risk_level: 'High',
      reason: 'Customer has no active health insurance policy recorded.',
    };
  }

  if (!policies.has('life') && customer.age >= 25) {
    return {
      rule_id: 'R6_NO_LIFE_PRIMARY',
      recommended_policy: 'life',
      risk_level: 'High',
      reason: 'Customer lacks term life protection for income replacement.',
    };
  }

  if (!policies.has('PA')) {
    return {
      rule_id: 'R7_NO_PA_RIDER',
      recommended_policy: 'PA',
      risk_level: 'Low',
      reason: 'Supplementary Personal Accident policy recommended for total emergency coverage.',
    };
  }

  if (!policies.has('critical_illness')) {
    return {
      rule_id: 'R8_NO_CRITICAL_ILLNESS',
      recommended_policy: 'critical_illness',
      risk_level: 'Low',
      reason: 'High-value Critical Illness add-on policy to safeguard savings during major medical treatments.',
    };
  }

  return {
    rule_id: 'R9_DEFAULT_MOTOR',
    recommended_policy: 'motor',
    risk_level: 'Low',
    reason: 'Multi-vehicle motor coverage add-on or zero-dep renewal top-up.',
  };
}
