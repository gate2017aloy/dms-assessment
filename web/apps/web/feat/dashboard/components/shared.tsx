import React from 'react';

// Custom Tooltip component for premium look
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 border border-border/50 backdrop-blur-md p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-foreground">{label || payload[0].name}</p>
        <p className="text-primary font-semibold">
          Count: <span className="text-foreground font-mono">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Colors mapping matching the SOC guidelines
export const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444', // red-500
  high: '#f97316',    // orange-500
  medium: '#eab308',  // yellow-500
  low: '#3b82f6',     // blue-500
  info: '#64748b',    // slate-500
};

export const STATUS_COLORS: Record<string, string> = {
  new: '#f43f5e',           // rose-500
  investigating: '#f59e0b', // amber-500
  resolved: '#10b981',      // emerald-500
  false_positive: '#64748b', // slate-500
};

export const CATEGORY_COLORS: Record<string, string> = {
  malware: '#ec4899',             // pink-500
  phishing: '#8b5cf6',            // violet-500
  unauthorized_access: '#3b82f6',  // blue-500
  data_exfiltration: '#f43f5e',   // rose-500
  policy_violation: '#14b8a6',    // teal-500
  suspicious_login: '#f59e0b',     // amber-500
};
