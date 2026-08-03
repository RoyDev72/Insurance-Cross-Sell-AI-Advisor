'use client';

import React, { useState } from 'react';
import { RecommendationResult, PolicyType } from '@/types';
import { Sparkles, Copy, Check, Send, ShieldCheck, Cpu, Code2, Clock, FileDown, ExternalLink } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: RecommendationResult;
}

const POLICY_DISPLAY_NAMES: Record<PolicyType, string> = {
  motor: 'Motor Insurance',
  health: 'Comprehensive Health Shield',
  life: 'Term Life Insurance',
  PA: 'Personal Accident Cover',
  critical_illness: 'Critical Illness Protection',
};

const RISK_BADGES = {
  High: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showArchitectureTrace, setShowArchitectureTrace] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(recommendation.whatsapp_message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = (recommendation.phone || '919876543210').replace(/\D/g, '');
  const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(recommendation.whatsapp_message)}`;

  const handleDownloadPDF = () => {
    const policyName = POLICY_DISPLAY_NAMES[recommendation.recommended_policy] || recommendation.recommended_policy;
    const existingStr = recommendation.existing_policies.map(p => POLICY_DISPLAY_NAMES[p] || p).join(', ');
    const printDate = new Date(recommendation.generated_at || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Insurance Cross-Sell Proposal - ${recommendation.customer_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #ffffff; color: #0f172a; padding: 40px; }
            .header { border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 22px; font-weight: 800; color: #4f46e5; letter-spacing: -0.5px; }
            .logo-sub { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
            .doc-title { text-align: right; }
            .doc-title h1 { font-size: 18px; font-weight: 800; color: #0f172a; }
            .doc-title p { font-size: 12px; color: #64748b; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
            .card-label { font-size: 10px; font-weight: 700; uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 6px; }
            .card-value { font-size: 14px; font-weight: 700; color: #0f172a; }
            .card-sub { font-size: 12px; color: #475569; margin-top: 2px; }
            .highlight-box { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 20px; margin-bottom: 25px; }
            .highlight-title { font-size: 12px; font-weight: 800; color: #3730a3; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
            .highlight-desc { font-size: 13px; color: #1e1b4b; font-weight: 600; line-height: 1.5; }
            .whatsapp-box { background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 14px; padding: 22px; margin-bottom: 30px; position: relative; }
            .whatsapp-header { font-size: 11px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; display: flex; justify-content: space-between; }
            .whatsapp-text { font-size: 13px; color: #14532d; line-height: 1.6; white-space: pre-wrap; font-family: system-ui, sans-serif; }
            .audit-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
            .audit-table th { background: #f1f5f9; text-align: left; padding: 10px 14px; border: 1px solid #cbd5e1; font-weight: 700; color: #334155; }
            .audit-table td { padding: 10px 14px; border: 1px solid #cbd5e1; color: #475569; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">CROSSSELL AI ADVISOR</div>
              <div class="logo-sub">AI-Assisted Portfolio Governance</div>
            </div>
            <div class="doc-title">
              <h1>Official Cross-Sell Proposal</h1>
              <p>Generated: ${printDate}</p>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-label">Customer Information</div>
              <div class="card-value">${recommendation.customer_name}</div>
              <div class="card-sub">Age ${recommendation.age} • ${recommendation.city}</div>
              <div class="card-sub" style="margin-top:4px; font-family:monospace; font-weight:600; color:#059669;">WhatsApp: +${cleanPhone}</div>
            </div>
            <div class="card">
              <div class="card-label">Recommended Coverage</div>
              <div class="card-value" style="color:#4f46e5;">${policyName}</div>
              <div class="card-sub">Active Policies: ${existingStr}</div>
            </div>
          </div>

          <div class="highlight-box">
            <div class="highlight-title">Coverage Gap Analysis Rationale</div>
            <div class="highlight-desc">"${recommendation.reason}"</div>
          </div>

          <div class="whatsapp-box">
            <div class="whatsapp-header">
              <span>💬 Generated WhatsApp Sales Copy</span>
              <span>Target: +${cleanPhone}</span>
            </div>
            <div class="whatsapp-text">${recommendation.whatsapp_message}</div>
          </div>

          <table class="audit-table">
            <thead>
              <tr>
                <th>Rule Execution ID</th>
                <th>Priority Risk Level</th>
                <th>AI Model Provider</th>
                <th>Execution Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${recommendation.rule_id || 'R1_MOTOR_NO_HEALTH'}</strong></td>
                <td><span style="color:#e11d48; font-weight:700;">${recommendation.risk_level || 'Medium'} Priority</span></td>
                <td>${recommendation.ai_provider}</td>
                <td>${recommendation.execution_latency_ms || 120} ms</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <span>Insurance Cross-Sell AI Advisor • Decoupled 3-Tier Architecture</span>
            <span>Confidential Sales Advisory Document</span>
          </div>
        </body>
      </html>
    `;

    const cleanName = recommendation.customer_name.replace(/[^a-zA-Z0-9]/g, '_');
    const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Insurance_Proposal_${cleanName}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-500/10 space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              AI Recommendation Generated
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${RISK_BADGES[recommendation.risk_level || 'Medium']}`}>
              {recommendation.risk_level || 'Medium'} Priority Risk
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
              <Clock className="h-3 w-3 text-cyan-400" /> {recommendation.execution_latency_ms || 120}ms
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5">
            Recommended Policy: {' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              {POLICY_DISPLAY_NAMES[recommendation.recommended_policy] || recommendation.recommended_policy}
            </span>
          </h2>
        </div>

        <button
          onClick={() => setShowArchitectureTrace(!showArchitectureTrace)}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all self-start sm:self-auto"
        >
          <Code2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>{showArchitectureTrace ? 'Hide AI Rule Inspector' : 'Inspect AI Rule Logic'}</span>
        </button>
      </div>

      {/* Explainable AI Rule Inspector */}
      {showArchitectureTrace && (
        <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-5 text-xs space-y-3 animate-fadeIn shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-300 font-semibold text-sm">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>Explainable AI Audit Trace & Rule Execution Log</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Rule ID: {recommendation.rule_id || 'R1_MOTOR_NO_HEALTH'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-slate-400">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200 block text-xs">Step 1: Deterministic Decision Logic</span>
              <p className="text-[11px]">Evaluates active policy array <code className="text-cyan-300 font-mono">[{recommendation.existing_policies.join(', ')}]</code></p>
              <div className="mt-1 text-emerald-400 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800">
                Rule Condition Matched: {recommendation.rule_id}
              </div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-semibold text-slate-200 block text-xs">Step 2: Natural Language Formatter</span>
              <p className="text-[11px]">Formatted via high-speed inference without altering decision logic.</p>
              <div className="mt-1 text-amber-400 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between">
                <span>Model: {recommendation.ai_provider}</span>
                <span>{recommendation.execution_latency_ms || 120}ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coverage Rationale */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start space-x-3">
        <ShieldCheck className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Coverage Gap Rationale</span>
          <p className="text-sm text-slate-200 mt-0.5 leading-relaxed font-medium">
            "{recommendation.reason}"
          </p>
        </div>
      </div>

      {/* WhatsApp Message */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Generated WhatsApp Sales Message
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Target Phone: +{cleanPhone}
          </span>
        </div>

        <div className="relative bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 text-slate-200 text-sm font-sans leading-relaxed whitespace-pre-wrap shadow-inner font-normal">
          {recommendation.whatsapp_message}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          onClick={handleCopy}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-md"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
          <span>{copied ? 'Copied!' : 'Copy Message'}</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
        >
          {downloaded ? <Check className="h-4 w-4 text-emerald-400" /> : <FileDown className="h-4 w-4 text-indigo-200" />}
          <span>{downloaded ? 'Proposal Downloaded!' : 'Download Proposal'}</span>
        </button>

        <a
          href={whatsappWebUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95"
        >
          <Send className="h-4 w-4" />
          <span>Send via WhatsApp Web</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
      </div>

    </div>
  );
}
