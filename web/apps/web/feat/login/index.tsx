'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
} from '@workspace/ui';
import { Shield, KeyRound, Mail, Loader2, Info } from 'lucide-react';

interface LoginFormProps {
  params?: any;
  searchParams?: any;
}

export function LoginForm({ params, searchParams }: LoginFormProps) {
  const router = useRouter();
  const nextSearchParams = useSearchParams();
  const from = nextSearchParams.get('from') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed');
        setIsLoading(false);
        return;
      }

      // Successful login
      router.push(from);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail('analyst@soc.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border border-border/40 bg-card/65 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary ring-1 ring-primary/20 animate-pulse">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            SOC Sentinel Portal
          </CardTitle>
          <CardDescription className="text-muted-foreground/80">
            Enter your analyst credentials to access the threat deck
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/95"
                htmlFor="email"
              >
                Analyst Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="analyst@soc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 border-border/60 focus-visible:ring-primary/20 bg-background/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/95"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  <KeyRound className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 border-border/60 focus-visible:ring-primary/20 bg-background/50"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/15">
                <Info className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 font-medium transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center justify-center gap-2 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying clearance...</span>
                </>
              ) : (
                'Access Threat Deck'
              )}
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/30"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-muted-foreground/75 uppercase tracking-widest">
              Evaluation
            </span>
            <div className="flex-grow border-t border-border/30"></div>
          </div>

          <Button
            variant="outline"
            onClick={handleAutofill}
            className="w-full h-10 text-xs border-dashed border-primary/40 hover:border-primary/80 hover:bg-primary/5 transition-all text-primary flex items-center justify-center gap-2"
            type="button"
            disabled={isLoading}
          >
            <Info className="h-3.5 w-3.5" />
            Autofill Seed Credentials
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
