'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Customer, PolicyType } from '@/types';
import { Search, Filter, AlertCircle, ArrowRight, UserPlus, CheckCircle2, Trash2, Loader2, Phone, MessageSquare } from 'lucide-react';
import AddCustomerModal from '@/components/AddCustomerModal';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface CustomerTableProps {
  customers: Customer[];
}

const POLICY_BADGES: Record<PolicyType, { label: string; style: string }> = {
  motor: { label: 'Motor', style: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  health: { label: 'Health', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  life: { label: 'Life', style: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  PA: { label: 'PA Rider', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  critical_illness: { label: 'Critical Illness', style: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
};

interface ConfirmDeleteModalProps {
  customer: Customer | null;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

function ConfirmDeleteModal({ customer, onClose, onConfirm, deleting }: ConfirmDeleteModalProps) {
  if (!customer) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget && !deleting) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-rose-500 via-red-400 to-orange-500" />

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Trash2 className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Remove Customer</h2>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Are you sure you want to remove{' '}
                <span className="text-white font-semibold">{customer.name}</span>? This will archive their record.
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-xs text-slate-400 mb-5">
            ⚠ This is a soft delete — the record is archived, not permanently removed.
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={deleting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Archiving...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span>Yes, Remove</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerTable({ customers: initialCustomers }: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [policyFilter, setPolicyFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm));

    const matchesPolicy =
      policyFilter === 'all'
        ? true
        : policyFilter.startsWith('missing_')
        ? !c.existing_policies.includes(policyFilter.replace('missing_', '') as PolicyType)
        : c.existing_policies.includes(policyFilter as PolicyType);

    return matchesSearch && matchesPolicy;
  });

  const handleAddSuccess = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setModalOpen(false);
    showToast(`${newCustomer.name} added successfully!`);
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/customers/${customerToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
        setCustomerToDelete(null);
        showToast('Customer archived.');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to archive customer.');
        setCustomerToDelete(null);
      }
    } catch {
      showToast('Network error — could not archive customer.');
      setCustomerToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/40 animate-fadeIn">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      <AddCustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <ConfirmDeleteModal
        customer={customerToDelete}
        onClose={() => !deleting && setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        deleting={deleting}
      />

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">

        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50">

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, city, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <select
                value={policyFilter}
                onChange={(e) => setPolicyFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Portfolios</option>
                <option value="motor">Has Motor</option>
                <option value="health">Has Health</option>
                <option value="life">Has Life</option>
                <option value="missing_health">Gap: Missing Health</option>
                <option value="missing_life">Gap: Missing Life</option>
                <option value="missing_PA">Gap: Missing PA</option>
              </select>
              <span className="text-xs text-slate-400 font-medium px-1">
                {filteredCustomers.length} found
              </span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20 border border-indigo-400/20 transition-all whitespace-nowrap flex-shrink-0"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Add Customer</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Customer Name</th>
                <th className="py-3.5 px-4">Contact (WhatsApp)</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Active Coverage</th>
                <th className="py-3.5 px-4">Detected Gap</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No customer records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const hasHealth = customer.existing_policies.includes('health');
                  const hasLife = customer.existing_policies.includes('life');
                  const hasMotor = customer.existing_policies.includes('motor');

                  let detectedGap = 'Personal Accident';
                  let gapColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';

                  if (hasMotor && !hasHealth) {
                    detectedGap = 'Health Protection';
                    gapColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                  } else if (!hasLife && customer.age >= 25) {
                    detectedGap = 'Term Life Cover';
                    gapColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
                  }

                  const phoneDisplay = customer.phone || '+91 98765 43210';
                  const cleanPhone = phoneDisplay.replace(/\D/g, '');

                  return (
                    <tr key={customer.id} className="hover:bg-slate-800/40 transition-colors group">

                      {/* Customer Name */}
                      <td className="py-4 px-6 font-semibold text-white">
                        <Link href={`/customers/${customer.id}`} className="flex items-center space-x-3 group-hover:text-indigo-300 transition-colors">
                          <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400 flex-shrink-0">
                            {customer.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100">{customer.name}</div>
                            <div className="text-xs text-slate-500 font-normal">ID: {customer.id}</div>
                          </div>
                        </Link>
                      </td>

                      {/* WhatsApp Phone */}
                      <td className="py-4 px-4 text-slate-300">
                        <a
                          href={`https://web.whatsapp.com/send?phone=${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono transition-all"
                        >
                          <MessageSquare className="h-3 w-3 text-emerald-400" />
                          <span>{phoneDisplay}</span>
                        </a>
                      </td>

                      {/* Demographics */}
                      <td className="py-4 px-4 text-slate-300">
                        <div className="text-sm font-medium">{customer.city}</div>
                        <div className="text-xs text-slate-500">Age {customer.age}</div>
                      </td>

                      {/* Active Coverage */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {customer.existing_policies.length === 0 ? (
                            <span className="text-[11px] text-slate-500 italic">None</span>
                          ) : customer.existing_policies.map((p) => {
                            const badge = POLICY_BADGES[p] || { label: p, style: 'bg-slate-800 text-slate-300 border-slate-700' };
                            return (
                              <span
                                key={p}
                                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badge.style}`}
                              >
                                {badge.label}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Detected Gap */}
                      <td className="py-4 px-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${gapColor} inline-flex items-center gap-1.5`}>
                          <AlertCircle className="h-3 w-3" />
                          {detectedGap}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/customers/${customer.id}`}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 border border-indigo-400/30 transition-all group-hover:translate-x-0"
                          >
                            <span>Generate Advisor</span>
                            <ArrowRight className="h-3.5 w-3.5 text-indigo-200" />
                          </Link>
                          <button
                            onClick={() => setCustomerToDelete(customer)}
                            title={`Remove ${customer.name}`}
                            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
