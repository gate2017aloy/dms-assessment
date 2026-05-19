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

export { SEVERITY_CONFIG, STATUS_CONFIG, CATEGORY_CONFIG } from '@/lib/constants';
