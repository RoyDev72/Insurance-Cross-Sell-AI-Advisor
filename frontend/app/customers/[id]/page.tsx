'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Customer, RecommendationResult, PolicyType } from '@/types';
import RecommendationCard from '@/components/RecommendationCard';
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Shield,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Phone,
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const POLICY_DISPLAY_NAMES: Record<PolicyType, string> = {
  motor: 'Motor Insurance',
  health: 'Comprehensive Health Shield',
  life: 'Term Life Insurance',
  PA: 'Personal Accident Cover',
  critical_illness: 'Critical Illness Protection',
};

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadCustomer() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/customers/${id}`);
        if (!res.ok) throw new Error('Customer not found');
        const data = await res.json();
        setCustomer(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load customer');
      } finally {
        setLoadingCustomer(false);
      }
    }
    loadCustomer();
  }, [id]);

  const handleGenerateRecommendation = async () => {
    if (!id) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/recommend/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate recommendation from backend');
      const data = await res.json();
      setRecommendation(data);
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  if (loadingCustomer) {
    return (
      <div className="py-20 text-center space-y-4 animate-fadeIn">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-sm text-slate-400">Fetching customer portfolio details from Express backend...</p>
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="py-16 text-center space-y-4 animate-fadeIn">
        <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Customer Not Found</h2>
        <p className="text-sm text-slate-400">The customer profile with ID "{id}" could not be located.</p>
        <Link
          href="/customers"
          className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const phoneDisplay = customer?.phone || '+91 98765 43210';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">

      <div>
        <Link
          href="/customers"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Customer Directory</span>
        </Link>
      </div>

      {customer && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center font-extrabold text-xl text-indigo-300">
                  {customer.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">{customer.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-mono text-emerald-400">
                    <Phone className="h-3.5 w-3.5 text-emerald-400" /> {phoneDisplay}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-indigo-400" /> Age {customer.age}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" /> {customer.city}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" /> Policy Since {customer.policy_purchase_date || '2023'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateRecommendation}
              disabled={generating}
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Evaluating Rules & LLM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>{recommendation ? 'Re-Generate AI Recommendation' : 'Generate Recommendation'}</span>
                </>
              )}
            </button>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-indigo-400" />
              Active Portfolio Coverage ({customer.existing_policies.length} Policies)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {customer.existing_policies.map((policy) => (
                <div
                  key={policy}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center space-x-3"
                >
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {POLICY_DISPLAY_NAMES[policy] || policy}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium">Active Policy</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {recommendation && (
        <div className="animate-fadeIn">
          <RecommendationCard recommendation={recommendation} />
        </div>
      )}

    </div>
  );
}
