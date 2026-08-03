import React from 'react';
import CustomerTable from '@/components/CustomerTable';
import { Customer } from '@/types';
import { Users } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const dynamic = 'force-dynamic';

async function getCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/customers`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch customer list');
    return await res.json();
  } catch (error) {
    console.error('Error fetching customers from Express backend:', error);
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6 animate-fadeIn">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Users className="h-4 w-4" />
            <span>Customer Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Customer Policy Portfolios</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, and manage customer profiles to discover cross-sell coverage opportunities.
          </p>
        </div>
      </div>

      <CustomerTable customers={customers} />
    </div>
  );
}
