'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DashboardSummary, PolicyType } from '@/types';
import { Shield, AlertTriangle, Sparkles } from 'lucide-react';

interface DashboardChartsProps {
  summary: DashboardSummary;
}

const POLICY_COLORS: Record<PolicyType, string> = {
  motor: '#3b82f6',
  health: '#10b981',
  life: '#8b5cf6',
  PA: '#f59e0b',
  critical_illness: '#ef4444',
};

const POLICY_LABELS: Record<PolicyType, string> = {
  motor: 'Motor Cover',
  health: 'Health Shield',
  life: 'Term Life',
  PA: 'Personal Accident',
  critical_illness: 'Critical Illness',
};

export default function DashboardCharts({ summary }: DashboardChartsProps) {
  const distributionData = (Object.keys(summary.policy_distribution) as PolicyType[]).map((key) => ({
    name: POLICY_LABELS[key] || key,
    value: summary.policy_distribution[key] || 0,
    color: POLICY_COLORS[key] || '#64748b',
  }));

  const gapsData = (Object.keys(summary.coverage_gaps_pct) as PolicyType[]).map((key) => ({
    name: POLICY_LABELS[key] || key,
    gap_pct: summary.coverage_gaps_pct[key] || 0,
    color: POLICY_COLORS[key] || '#64748b',
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-400" />
              Active Policy Distribution
            </h3>
            <p className="text-xs text-slate-400">Total active policy count across customer base</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
            {summary.total_customers} Total Profiles
          </span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-slate-300 text-xs font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Portfolio Coverage Gaps (%)
            </h3>
            <p className="text-xs text-slate-400">Percentage of customers lacking protection by product</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Top Opportunity: {POLICY_LABELS[summary.top_recommended_policy]}
          </span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gapsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value: any) => [`${value}% Unprotected`, 'Coverage Gap']}
              />
              <Bar dataKey="gap_pct" radius={[6, 6, 0, 0]}>
                {gapsData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
