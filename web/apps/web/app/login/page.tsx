import React, { Suspense } from 'react';
import { Card } from '@workspace/ui';
import { Loader2 } from 'lucide-react';
import { LoginForm } from '@/feat/login';

interface PageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}

export default async function LoginPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Dynamic colorful decorative background glow orbs */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none"></div>

      <Suspense
        fallback={
          <Card className="w-full max-w-md border border-border/40 bg-card/65 shadow-2xl backdrop-blur-md p-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Initializing access portal...</p>
            </div>
          </Card>
        }
      >
        <LoginForm params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
