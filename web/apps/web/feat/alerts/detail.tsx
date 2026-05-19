'use client';

import React from 'react';
import { useAlertDetail } from './use-alert-detail';
import { AlertDetailSkeleton } from './components/alert-detail-skeleton';
import { AlertDetailError } from './components/alert-detail-error';
import { AlertDetailHeader } from './components/alert-detail-header';
import { AlertTelemetry } from './components/alert-telemetry';
import { AlertTriagePanel } from './components/alert-triage-panel';

export function AlertDetail({ id }: { id: string }) {
  const {
    alert,
    isLoading,
    isError,
    successFeedback,
    isUpdating,
    handleTriageUpdate,
    handleAssignToMe,
    handleUnassign,
    goBack,
  } = useAlertDetail(id);

  if (isLoading) {
    return <AlertDetailSkeleton />;
  }

  if (isError || !alert) {
    return <AlertDetailError goBack={goBack} />;
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Alert Header */}
      <AlertDetailHeader
        alert={alert}
        successFeedback={successFeedback}
        goBack={goBack}
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Left Columns - Telemetry Details & Raw Events */}
        <div className="lg:col-span-2">
          <AlertTelemetry alert={alert} />
        </div>

        {/* Right Column - Interactive Triage Action controls */}
        <div>
          <AlertTriagePanel
            alert={alert}
            isUpdating={isUpdating}
            handleTriageUpdate={handleTriageUpdate}
            handleAssignToMe={handleAssignToMe}
            handleUnassign={handleUnassign}
          />
        </div>
      </div>
    </main>
  );
}
