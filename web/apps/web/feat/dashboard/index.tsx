'use client';

import React from 'react';
import { Card, Button } from '@workspace/ui';
import { ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useDashboard } from './use-dashboard';
import { MetricCards } from './components/metric-cards';
import { SeverityChart } from './components/severity-chart';
import { StatusChart } from './components/status-chart';
import { TimelineChart } from './components/timeline-chart';
import { CategoryChart } from './components/category-chart';

interface DashboardProps {
  params?: any;
  searchParams?: any;
}

export function Dashboard({ params, searchParams }: DashboardProps) {
  const {
    router,
    isLoading,
    isError,
    refetch,
    mounted,
    handleDeepLink,
    totalAlerts,
    criticalAlerts,
    investigatingAlerts,
    falsePositives,
    severityDistribution,
    statusDistribution,
    categoryDistribution,
    alertsOverTime,
  } = useDashboard();

  if (isError) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive animate-bounce" />
        <h2 className="text-xl font-bold">Failed to load security metrics</h2>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry Connection
        </Button>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text">
            Security Incident Deck
          </h1>
          <p className="text-sm text-muted-foreground">
            Dynamic threat analytics, real-time posture indicators, and interactive telemetry data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push('/alerts')}
            size="sm"
            className="group gap-2 px-4 shadow-lg hover:shadow-primary/10 transition-all font-semibold"
          >
            Live Alerts Console
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      <MetricCards
        isLoading={isLoading}
        totalAlerts={totalAlerts}
        criticalAlerts={criticalAlerts}
        investigatingAlerts={investigatingAlerts}
        falsePositives={falsePositives}
        handleDeepLink={handleDeepLink}
      />

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <SeverityChart
          isLoading={isLoading}
          mounted={mounted}
          totalAlerts={totalAlerts}
          severityDistribution={severityDistribution}
          handleDeepLink={handleDeepLink}
        />
        <StatusChart
          isLoading={isLoading}
          mounted={mounted}
          statusDistribution={statusDistribution}
          handleDeepLink={handleDeepLink}
        />
        <TimelineChart
          isLoading={isLoading}
          mounted={mounted}
          alertsOverTime={alertsOverTime}
          handleDeepLink={handleDeepLink}
        />
        <CategoryChart
          isLoading={isLoading}
          mounted={mounted}
          categoryDistribution={categoryDistribution}
          handleDeepLink={handleDeepLink}
        />
      </div>

      {/* Authentication complete / SOC overview footer banner */}
      <Card className="border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-primary">System Monitoring Engine</h3>
          <p className="text-sm text-muted-foreground">
            Operating in <code className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">High Fidelity Triage Mode</code>. Telemetry synchronizes live with system endpoints.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1.5 rounded-xl shrink-0">
          <ShieldCheck className="h-4 w-4" />
          SOC NODE SECURE
        </div>
      </Card>
    </main>
  );
}
