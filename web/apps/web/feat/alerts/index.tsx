'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui';
import { ArrowLeft, Activity } from 'lucide-react';
import { useAlerts } from './use-alerts';
import { AlertsSummary } from './components/alerts-summary';
import { AlertsFilters } from './components/alerts-filters';
import { AlertsTable } from './components/alerts-table';

interface AlertsProps {
  params?: any;
  searchParams?: any;
}

export function Alerts({ params, searchParams }: AlertsProps) {
  const router = useRouter();
  
  const {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    isLoading,
    isError,
    refetch,
    alertsList,
    totalAlertsCount,
    totalPages,
    resetFilters,
    handleRowClick,
  } = useAlerts();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="gap-1.5 px-3 py-1.5 hover:bg-muted/60 transition-all text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
      </div>

      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text">
            Security Incident Alerts
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Triage system for high-fidelity endpoint alerts, phishing indicators, policy violations, and suspicious network activities.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-card/65 px-4 py-2 rounded-xl border border-border/45 backdrop-blur-md shrink-0">
          <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
          <div className="text-xs font-semibold text-muted-foreground">
            <span className="text-foreground font-bold tabular-nums text-sm mr-1">
              {totalAlertsCount.toLocaleString()}
            </span>
            Total Incidents
          </div>
        </div>
      </div>

      {/* Triage Dashboard Summary Cards */}
      <AlertsSummary
        isLoading={isLoading}
        totalAlertsCount={totalAlertsCount}
        filters={filters}
        alertsList={alertsList}
      />

      {/* Elegant Controls and Filters Bar */}
      <AlertsFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      {/* Main Alerts Incidents Table */}
      <AlertsTable
        alertsList={alertsList}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        totalPages={totalPages}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        handleRowClick={handleRowClick}
      />
    </main>
  );
}
