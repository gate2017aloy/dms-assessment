'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@workspace/ui';
import { ArrowLeft } from 'lucide-react';

export default function AlertsPage() {
  const router = useRouter();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="gap-1 px-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-muted-foreground">
          Complete data table and triage controls for high-fidelity alerts.
        </p>
      </div>

      {/* Phase 3 Alerts list placeholder */}
      <Card className="border border-border/40 bg-card/30 p-12 text-center space-y-4">
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-semibold">Alerts Deck (Phase 4 & 5)</h3>
          <p className="text-sm text-muted-foreground">
            This space will host the robust, paginated, sortable, and filterable alerts data table integrated with search, custom badges, and detail views.
          </p>
        </div>
      </Card>
    </main>
  );
}
