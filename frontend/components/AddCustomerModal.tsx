'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Loader2, AlertCircle, CheckCircle2, Phone } from 'lucide-react';
import { Customer, PolicyType } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const POLICY_OPTIONS: { value: PolicyType; label: string; color: string }[] = [
  { value: 'motor', label: 'Motor Insurance', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { value: 'health', label: 'Health Shield', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { value: 'life', label: 'Term Life', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { value: 'PA', label: 'PA Rider', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { value: 'critical_illness', label: 'Critical Illness', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
];

interface FormErrors {
  name?: string;
  age?: string;
  city?: string;
  phone?: string;
  server?: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customer: Customer) => void;
}

export default function AddCustomerModal({ isOpen, onClose, onSuccess }: AddCustomerModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPolicies, setSelectedPolicies] = useState<PolicyType[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setAge('');
      setCity('');
      setPhone('');
      setSelectedPolicies([]);
      setErrors({});
      setSubmitting(false);
      setTimeout(() => nameRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const togglePolicy = (policy: PolicyType) => {
    setSelectedPolicies((prev) =>
      prev.includes(policy) ? prev.filter((p) => p !== policy) : [...prev, policy]
    );
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    const ageNum = parseInt(age, 10);
    if (!age) newErrors.age = 'Age is required.';
    else if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) newErrors.age = 'Age must be between 18 and 100.';
    if (!city.trim()) newErrors.city = 'City is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(`${BACKEND_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          age: parseInt(age, 10),
          city: city.trim(),
          phone: phone.trim() || '+91 98765 43210',
          existing_policies: selectedPolicies,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ server: data.error || 'Something went wrong. Please try again.' });
        return;
      }

      onSuccess(data as Customer);
    } catch {
      setErrors({ server: 'Network error. Please check if the Express backend server is running.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn">
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500" />

        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Customer Profile</h2>
              <p className="text-xs text-slate-400">Fill in portfolio & WhatsApp contact details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">

            {errors.server && (
              <div className="flex items-start gap-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-sm text-rose-300 animate-fadeIn">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-rose-400" />
                <span>{errors.server}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="modal-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="modal-name"
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((prev) => ({ ...prev, name: undefined })); }}
                placeholder="e.g. Priya Patel"
                className={`w-full bg-slate-950 border rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Age & City row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="modal-age" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Age <span className="text-rose-400">*</span>
                </label>
                <input
                  id="modal-age"
                  type="number"
                  min={18}
                  max={100}
                  value={age}
                  onChange={(e) => { setAge(e.target.value); if (errors.age) setErrors((prev) => ({ ...prev, age: undefined })); }}
                  placeholder="18–100"
                  className={`w-full bg-slate-950 border rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.age ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                {errors.age && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.age}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="modal-city" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  City <span className="text-rose-400">*</span>
                </label>
                <input
                  id="modal-city"
                  type="text"
                  value={city}
                  onChange={(e) => { setCity(e.target.value); if (errors.city) setErrors((prev) => ({ ...prev, city: undefined })); }}
                  placeholder="e.g. Mumbai"
                  className={`w-full bg-slate-950 border rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                    errors.city ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.city}
                  </p>
                )}
              </div>
            </div>

            {/* WhatsApp Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="modal-phone" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                <span>WhatsApp Phone Number</span>
              </label>
              <input
                id="modal-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
              <p className="text-[11px] text-slate-500">Prefilled in WhatsApp Web direct message link</p>
            </div>

            {/* Existing Policies checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Existing Policies <span className="text-slate-500 font-normal normal-case">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {POLICY_OPTIONS.map((opt) => {
                  const checked = selectedPolicies.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? `${opt.color} border-opacity-60`
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                        checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-600'
                      }`}>
                        {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => togglePolicy(opt.value)}
                      />
                      <span className={`text-sm font-medium ${checked ? '' : 'text-slate-400'}`}>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/40">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Add Customer Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
