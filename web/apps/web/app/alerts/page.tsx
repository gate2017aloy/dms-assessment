'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@workspace/ui';
import { Shield, LogOut, Loader2, ArrowLeft } from 'lucide-react';

export default function AlertsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border/40 bg-card/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/20">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight text-lg">SOC Sentinel</span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="gap-1.5 border-border/60 hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 transition-all"
            >
              {isLoggingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
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
    </div>
  );
}
