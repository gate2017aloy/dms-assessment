import React from 'react';
import { Button } from '@workspace/ui';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AlertDetailErrorProps {
  goBack: () => void;
}

export function AlertDetailError({ goBack }: AlertDetailErrorProps) {
  return (
    <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center space-y-6">
      <div className="rounded-full bg-red-500/10 p-4 text-red-500 ring-1 ring-red-500/20 w-fit mx-auto">
        <ShieldAlert className="h-8 w-8 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Incident Log Not Found</h2>
        <p className="text-sm text-muted-foreground">The incident hash does not exist or may have been consolidated.</p>
      </div>
      <Button variant="outline" onClick={goBack} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" />
        Return to Incidents Deck
      </Button>
    </main>
  );
}
