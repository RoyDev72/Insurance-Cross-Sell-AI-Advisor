'use client';

import React, { useState } from 'react';
import { Customer, PolicyType } from '@/types';
import { Download, CheckCircle2, FileSpreadsheet } from 'lucide-react';

interface ExportCSVButtonProps {
  customers: Customer[];
}

export default function ExportCSVButton({ customers }: ExportCSVButtonProps) {
  const [exported, setExported] = useState(false);

  const handleExportCSV = () => {
    if (!customers || customers.length === 0) return;

    const headers = ['Customer ID', 'Name', 'Age', 'City', 'Active Policies', 'Detected Policy Gap', 'Purchase Date'];
    
    const rows = customers.map((c) => {
      const hasHealth = c.existing_policies.includes('health');
      const hasLife = c.existing_policies.includes('life');
      const hasMotor = c.existing_policies.includes('motor');

      let detectedGap = 'Personal Accident';
      if (hasMotor && !hasHealth) detectedGap = 'Health Protection';
      else if (!hasLife && c.age >= 25) detectedGap = 'Term Life Cover';

      return [
        `"${c.id}"`,
        `"${c.name}"`,
        c.age,
        `"${c.city}"`,
        `"${c.existing_policies.join('; ')}"`,
        `"${detectedGap}"`,
        `"${c.policy_purchase_date || ''}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Insurance_CrossSell_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <button
      onClick={handleExportCSV}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md transition-all whitespace-nowrap"
    >
      {exported ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-emerald-400">Leads CSV Exported!</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
          <span>Export Lead List (CSV)</span>
        </>
      )}
    </button>
  );
}
