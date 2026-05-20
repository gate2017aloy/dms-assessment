'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
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

  // If it's the login page, render children directly without the authenticated shell
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border/40 bg-card/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => router.push('/dashboard')}
          >
            <div className="rounded-lg bg-primary/10 p-2 text-primary ring-1 ring-primary/20">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-semibold tracking-tight text-lg">SOC Sentinel</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground text-right hidden sm:block">
              <div className="font-medium text-foreground">Analyst Active</div>
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

      {/* Main Content Area */}
      {children}
    </div>
  );
}
