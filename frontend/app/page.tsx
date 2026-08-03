import React from 'react';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import CustomerTable from '@/components/CustomerTable';
import ExportCSVButton from '@/components/ExportCSVButton';
import { DashboardSummary, Customer } from '@/types';
import { Users, AlertTriangle, Sparkles, TrendingUp, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const dynamic = 'force-dynamic';

async function getDashboardData(): Promise<{ summary: DashboardSummary; customers: Customer[] }> {
  try {
    const [summaryRes, customersRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/dashboard/summary`, { cache: 'no-store' }),
      fetch(`${BACKEND_URL}/api/customers`, { cache: 'no-store' }),
    ]);

    if (!summaryRes.ok || !customersRes.ok) {
      throw new Error('Failed to fetch data from backend server');
    }

    const summary = await summaryRes.json();
    const customers = await customersRes.json();
    return { summary, customers };
  } catch (error) {
    console.error('Error fetching dashboard data from Express backend:', error);
    return {
      summary: {
        total_customers: 0,
        policy_distribution: { motor: 0, health: 0, life: 0, PA: 0, critical_illness: 0 },
        coverage_gaps_pct: { motor: 0, health: 0, life: 0, PA: 0, critical_illness: 0 },
        top_recommended_policy: 'health',
        high_priority_leads_count: 0,
      },
      customers: [],
    };
  }
}

export default async function DashboardPage() {
  const { summary, customers } = await getDashboardData();

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Top Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Decoupled 3-Tier AI Advisor Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Insurance Cross-Sell AI Advisor
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Separates deterministic rules-based coverage gap evaluation from LLM natural language generation. Powered by Express.js backend (Port 5000) and Supabase database.
            </p>
          </div>

          <div className="flex-shrink-0">
            <ExportCSVButton customers={customers} />
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Portfolios</span>
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">{summary.total_customers}</span>
            <span className="text-xs text-slate-500 ml-2">Analyzed records</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> 100% Evaluated by Rules Engine
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Priority Leads</span>
            <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-rose-400">{summary.high_priority_leads_count}</span>
            <span className="text-xs text-slate-500 ml-2">Customers</span>
          </div>
          <div className="mt-2 text-xs text-rose-400/90 font-medium">
            Missing Motor → Health or Life protection
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Gap Product</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-emerald-400 capitalize">{summary.top_recommended_policy}</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            {summary.coverage_gaps_pct.health}% portfolio health coverage gap
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Guardrail Status</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-100">Zero Hallucination</span>
          </div>
          <div className="mt-2 text-xs text-purple-300 font-medium">
            LLM constrained to message formatting only
          </div>
        </div>

      </div>

      {/* Visual Analytics Charts */}
      <DashboardCharts summary={summary} />

      {/* Customer Lead Directory Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Customer Portfolios & Opportunities</h2>
            <p className="text-xs text-slate-400">Select any customer to generate personalized WhatsApp recommendations</p>
          </div>
          <Link
            href="/customers"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All Portfolios</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <CustomerTable customers={customers} />
      </div>

    </div>
  );
}
