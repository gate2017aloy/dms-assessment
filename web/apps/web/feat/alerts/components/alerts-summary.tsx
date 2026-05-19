import React from 'react';
import { Card, CardContent, Skeleton } from '@workspace/ui';
import { ShieldAlert, Clock, Activity, CheckCircle } from 'lucide-react';
import type { Alert, AlertsFilterState } from '../types';

interface AlertsSummaryProps {
  isLoading: boolean;
  totalAlertsCount: number;
  filters: AlertsFilterState;
  alertsList: Alert[];
}

export function AlertsSummary({
  isLoading,
  totalAlertsCount,
  filters,
  alertsList,
}: AlertsSummaryProps) {
  const criticalCount = isLoading
    ? 0
    : filters.severity === 'critical' || filters.severity === 'all'
    ? totalAlertsCount
    : 0;

  const unassignedCount = isLoading
    ? 0
    : alertsList.filter((a) => !a.assignee).length;

  const investigatingCount = isLoading
    ? 0
    : filters.status === 'investigating' || filters.status === 'all'
    ? alertsList.filter((a) => a.status === 'investigating').length
    : 0;

  const mitigatedCount = isLoading
    ? 0
    : filters.status === 'resolved' || filters.status === 'all'
    ? alertsList.filter((a) => a.status === 'resolved').length
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Critical Priority */}
      <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Critical Priority
            </p>
            <h3 className="text-2xl font-bold text-red-500 tabular-nums">
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                criticalCount.toLocaleString()
              )}
            </h3>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/15">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Unassigned */}
      <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Unassigned
            </p>
            <h3 className="text-2xl font-bold text-violet-500 tabular-nums">
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                unassignedCount.toLocaleString()
              )}
            </h3>
          </div>
          <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500 border border-violet-500/15">
            <Clock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Investigating */}
      <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Investigating
            </p>
            <h3 className="text-2xl font-bold text-amber-500 tabular-nums">
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                investigatingCount.toLocaleString()
              )}
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/15">
            <Activity className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Mitigated */}
      <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Mitigated
            </p>
            <h3 className="text-2xl font-bold text-emerald-500 tabular-nums">
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                mitigatedCount.toLocaleString()
              )}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/15">
            <CheckCircle className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
