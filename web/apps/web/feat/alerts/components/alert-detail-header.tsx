import React from 'react';
import { Button } from '@workspace/ui';
import { ArrowLeft } from 'lucide-react';
import { severityConfig, statusConfig } from '../constants';
import type { Alert } from '../types';

interface AlertDetailHeaderProps {
  alert: Alert;
  successFeedback: string | null;
  goBack: () => void;
}

export function AlertDetailHeader({ alert, successFeedback, goBack }: AlertDetailHeaderProps) {
  const severity = alert.severity;
  const status = alert.status;
  const cfg = severityConfig[severity] || severityConfig.info;
  const IconComponent = cfg.icon;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb and Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="gap-1.5 px-3 py-1.5 hover:bg-muted/60 transition-all text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Alerts List
        </Button>

        {successFeedback && (
          <div className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md animate-fade-in">
            {successFeedback}
          </div>
        )}
      </div>

      {/* Incident Header */}
      <div className="border-b border-border/40 pb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cfg.bg}`}>
            <IconComponent className="h-3 w-3" />
            {cfg.label} Priority
          </span>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${statusConfig[status]?.bg}`}>
            Status: {statusConfig[status]?.label}
          </span>
          <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded border border-border/20">
            ID: {alert.id}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {alert.title}
        </h1>
        
        <p className="text-sm text-muted-foreground max-w-4xl">
          {alert.description}
        </p>
      </div>
    </div>
  );
}
