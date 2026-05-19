import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@workspace/ui';
import { Server, Terminal, Clock, FileCode, Tag } from 'lucide-react';
import { categoryLabels } from '../constants';
import type { Alert } from '../types';

interface AlertTelemetryProps {
  alert: Alert;
}

export function AlertTelemetry({ alert }: AlertTelemetryProps) {
  return (
    <div className="space-y-6">
      {/* Telemetry Metadata Card */}
      <Card className="bg-card/25 border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/30 px-5 py-4">
          <CardTitle className="text-sm font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Incident Source Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Affected Asset</span>
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {alert.affectedAsset}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sensor / Source</span>
            <div className="text-foreground font-medium flex items-center gap-2">
              <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded border border-border/20">
                {alert.source}
              </code>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Incident Category</span>
            <div className="text-foreground font-medium flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              {categoryLabels[alert.category] || alert.category}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Detected On</span>
            <div className="text-foreground font-medium flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Event Codeblock Inspector */}
      <Card className="bg-card/25 border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/30 px-5 py-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-500" />
            Raw Event Telemetry JSON
          </CardTitle>
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
            <FileCode className="h-3 w-3" />
            SIEM STREAM
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <pre className="text-xs font-mono p-5 bg-zinc-950 text-zinc-300 overflow-x-auto leading-relaxed border-t border-zinc-800 selection:bg-primary/20 selection:text-primary max-h-[420px]">
            <code>{JSON.stringify(alert.rawEvent, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
