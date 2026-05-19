import React from 'react';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  Skeleton,
} from '@workspace/ui';
import {
  Shield,
  AlertTriangle,
  Activity,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface MetricCardsProps {
  isLoading: boolean;
  totalAlerts: number;
  criticalAlerts: number;
  investigatingAlerts: number;
  falsePositives: number;
  handleDeepLink: (type: string, value: string) => void;
}

export function MetricCards({
  isLoading,
  totalAlerts,
  criticalAlerts,
  investigatingAlerts,
  falsePositives,
  handleDeepLink,
}: MetricCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {/* Total Alerts */}
      <Card
        onClick={() => handleDeepLink('all', '')}
        className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-primary/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
            Total Alerts
          </CardDescription>
          <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-all">
            <Shield className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-extrabold tracking-tight tabular-nums">
            {isLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              totalAlerts.toLocaleString()
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <span>View all system logs</span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </p>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      <Card
        onClick={() => handleDeepLink('severity', 'critical')}
        className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-red-500/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-red-500 transition-colors">
            Critical Alerts
          </CardDescription>
          <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500/20 transition-all">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-extrabold tracking-tight text-red-500 tabular-nums">
            {isLoading ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              criticalAlerts.toLocaleString()
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <span className="group-hover:text-red-400/90 transition-colors">Immediate action required</span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-red-400" />
          </p>
        </CardContent>
      </Card>

      {/* Investigating Alerts */}
      <Card
        onClick={() => handleDeepLink('status', 'investigating')}
        className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-amber-500/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-amber-500 transition-colors">
            Investigating
          </CardDescription>
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500/20 transition-all">
            <Activity className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-extrabold tracking-tight text-amber-500 tabular-nums">
            {isLoading ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              investigatingAlerts.toLocaleString()
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <span className="group-hover:text-amber-400/90 transition-colors">Triage operations active</span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-400" />
          </p>
        </CardContent>
      </Card>

      {/* False Positives */}
      <Card
        onClick={() => handleDeepLink('status', 'false_positive')}
        className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-slate-400/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full blur-xl group-hover:bg-slate-500/10 transition-all duration-500" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-slate-300 transition-colors">
            False Positives
          </CardDescription>
          <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400 group-hover:bg-slate-500/20 transition-all">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-3xl font-extrabold tracking-tight text-slate-400 tabular-nums">
            {isLoading ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              falsePositives.toLocaleString()
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <span className="group-hover:text-slate-300/90 transition-colors">Noise reduction telemetry</span>
            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
