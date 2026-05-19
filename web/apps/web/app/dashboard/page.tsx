'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@workspace/ui';
import { Shield, LogOut, Loader2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function DashboardPage() {
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
            <div className="text-xs text-muted-foreground text-right hidden sm:block">
              <div className="font-medium text-foreground">Analyst Active</div>
              <div>clearance_level_1</div>
            </div>
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Threat Landscape Overview</h1>
          <p className="text-muted-foreground">
            Real-time security analytics and incident response deck.
          </p>
        </div>

        {/* Placeholder KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-border/40 bg-card/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">Total Alerts</CardDescription>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,000</div>
              <p className="text-xs text-muted-foreground mt-1">Across 30 days</p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">Critical Threats</CardDescription>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">30</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate action required</p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">Unassigned</CardDescription>
              <HelpCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">400</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting triage</p>
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-wider">Resolved</CardDescription>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">200</div>
              <p className="text-xs text-muted-foreground mt-1">Closed successfully</p>
            </CardContent>
          </Card>
        </div>

        {/* Phase 3 Status Banner */}
        <Card className="border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-primary">Authentication Complete!</h3>
            <p className="text-sm text-muted-foreground">
              You are signed in as <code className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">analyst@soc.com</code>. The middleware successfully protects all dashboard, alerts, and API routes.
            </p>
          </div>
          <Button onClick={() => router.push('/alerts')} size="sm" className="shrink-0">
            View Alerts Table
          </Button>
        </Card>
      </main>
    </div>
  );
}
