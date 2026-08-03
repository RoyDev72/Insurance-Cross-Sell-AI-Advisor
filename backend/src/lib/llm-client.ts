import { Customer, PolicyType } from '../types/index.js';

export interface LLMResponse {
  whatsapp_message: string;
  provider: string;
}

const POLICY_DISPLAY_NAMES: Record<PolicyType, string> = {
  motor: 'Motor / Auto Insurance',
  health: 'Comprehensive Health Shield',
  life: 'Term Life Insurance',
  PA: 'Personal Accident Cover',
  critical_illness: 'Critical Illness Protection Plan',
};

function generateTemplateMessage(customer: Customer, recommendedPolicy: PolicyType, reason: string): string {
  const policyName = POLICY_DISPLAY_NAMES[recommendedPolicy] || recommendedPolicy;
  const existingStr = customer.existing_policies.map(p => POLICY_DISPLAY_NAMES[p] || p).join(' & ');

  switch (recommendedPolicy) {
    case 'health':
      return `Hi ${customer.name} 👋, hope you are doing well in ${customer.city}! \n\nWe noticed you currently have active cover for ${existingStr}. While your vehicle is well protected, your portfolio currently lacks dedicated Health Insurance to cover unexpected medical bills.\n\n🛡️ *Why add Health Protection today?*\n- Cashless hospitalization across 10,000+ top hospitals\n- Tax savings under Sec 80D up to ₹75,000\n- Complete coverage for your family\n\nWould you like me to share a quick 2-minute personalized quote tailored for you?`;

    case 'life':
      return `Hello ${customer.name}! 👋 Greetings from your Insurance Advisory team.\n\nThank you for trusting us with your ${existingStr}. As part of our annual portfolio review, we identified that you don't have an active Term Life plan in place.\n\n💼 *Why Term Life Insurance is essential:*\n- High sum assured (up to ₹1 Crore) at affordable premiums\n- 100% financial safety net for your family's future\n- Tax benefit under Sec 80C\n\nCan I send over a quick comparison table of top term plans for your review?`;

    case 'PA':
      return `Hi ${customer.name} 😊! Hope you are having a great week in ${customer.city}.\n\nGreat job on keeping your ${existingStr} active! To make your coverage complete, we strongly recommend adding a *Personal Accident Rider*.\n\n⚡ *Key Benefits:*\n- Total & Partial Disability lump-sum payout\n- Income protection during accidental recovery\n- Extremely low annual premium starting at under ₹150/month\n\nReply 'YES' if you'd like a quick brochure sent to your WhatsApp!`;

    case 'critical_illness':
      return `Dear ${customer.name}, hope all is well! 🩺\n\nYour insurance portfolio is in great shape with ${existingStr}. However, standard health insurance often has limits for major illnesses.\n\n❤️ *Protect your savings with Critical Illness Cover:*\n- Lump-sum cash payout immediately upon diagnosis (Cancer, Heart Attack, Stroke, etc.)\n- No hospital bill submission required\n- Protects your hard-earned investments\n\nLet me know if we can schedule a brief 5-minute call to discuss your optimal cover amount.`;

    default:
      return `Hi ${customer.name} 👋, thank you for being a valued client in ${customer.city}! We reviewed your portfolio (${existingStr}) and found an opportunity to upgrade your ${policyName} with exclusive renewal discounts. Reply to this message to claim your offer!`;
  }
}

export async function generateWhatsAppMessage(
  customer: Customer,
  recommendedPolicy: PolicyType,
  reason: string
): Promise<LLMResponse> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  const promptText = `You are an expert Indian insurance advisor crafting a WhatsApp cross-sell message.
Customer: ${customer.name}, Age: ${customer.age}, City: ${customer.city}
Existing Policies: ${customer.existing_policies.join(', ')}
Recommended Policy: ${recommendedPolicy} (${POLICY_DISPLAY_NAMES[recommendedPolicy] || recommendedPolicy})
Deterministic Reason: ${reason}

Instructions:
1. Write a polite, engaging, highly personalized WhatsApp message (max 90 words).
2. Use emojis and bullet points suitable for WhatsApp formatting.
3. Include a clear, non-pushy Call To Action.
4. Return ONLY the message text without extra intro/outro commentary.`;

  // 1. Try Free Google Gemini API
  if (geminiApiKey) {
    const geminiModels = [
      'gemini-2.0-flash',
      'gemini-2.0-flash-lite',
    ];

    for (const model of geminiModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            return { whatsapp_message: text, provider: `Google ${model} (Free API)` };
          }
        } else {
          const errText = await response.text();
          console.warn(`[Gemini ${model} Error ${response.status}]:`, errText);
        }
      } catch (err) {
        console.warn(`Gemini ${model} API call failed:`, err);
      }
    }
  }

  // 2. Try Free Groq API
  if (groqApiKey) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 250,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) {
          return { whatsapp_message: text, provider: 'Groq Llama-3.3 70B (Free API)' };
        }
      }
    } catch (err) {
      console.warn('Groq API call failed:', err);
    }
  }

  // 3. Try OpenRouter API
  if (openrouterApiKey) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterApiKey}`,
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite:free',
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 250,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) {
          return { whatsapp_message: text, provider: 'OpenRouter Free Gemini API' };
        }
      }
    } catch (err) {
      console.warn('OpenRouter API call failed:', err);
    }
  }

  // 4. Try Anthropic API
  if (anthropicApiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 300,
          messages: [{ role: 'user', content: promptText }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text?.trim();
        if (text) {
          return { whatsapp_message: text, provider: 'Anthropic Claude-3.5 Sonnet' };
        }
      }
    } catch (err) {
      console.warn('Anthropic API call failed:', err);
    }
  }

  // 5. Try OpenAI API
  if (openaiApiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: promptText }],
          max_tokens: 250,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) {
          return { whatsapp_message: text, provider: 'OpenAI GPT-4o-mini' };
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed:', err);
    }
  }

  // 6. Fallback template engine
  return {
    whatsapp_message: generateTemplateMessage(customer, recommendedPolicy, reason),
    provider: 'Rule-Guided Template Engine (Mock LLM)',
  };
}
