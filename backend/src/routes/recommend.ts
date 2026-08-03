import { Router, Request, Response } from 'express';
import { fetchCustomerById } from '../lib/supabase.js';
import { evaluateCrossSellRules } from '../lib/recommendation-engine.js';
import { generateWhatsAppMessage } from '../lib/llm-client.js';

const router = Router();

// POST /api/recommend/:id
router.post('/:id', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const customerId = req.params.id;
    const customer = await fetchCustomerById(customerId);

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const ruleResult = evaluateCrossSellRules(customer);
    const llmResult = await generateWhatsAppMessage(
      customer,
      ruleResult.recommended_policy,
      ruleResult.reason
    );
    const execution_latency_ms = Date.now() - startTime;

    res.json({
      customer_id: customer.id,
      customer_name: customer.name,
      age: customer.age,
      city: customer.city,
      phone: customer.phone || '919876543210',
      existing_policies: customer.existing_policies,
      recommended_policy: ruleResult.recommended_policy,
      reason: ruleResult.reason,
      rule_id: ruleResult.rule_id,
      risk_level: ruleResult.risk_level,
      whatsapp_message: llmResult.whatsapp_message,
      ai_provider: llmResult.provider,
      execution_latency_ms,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating recommendation:', error);
    res.status(500).json({ error: 'Failed to generate recommendation' });
  }
});

export default router;
