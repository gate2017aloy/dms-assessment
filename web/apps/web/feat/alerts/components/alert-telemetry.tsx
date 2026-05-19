import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@workspace/ui';
import { Server, Terminal, Clock, FileCode, Tag, ChevronDown } from 'lucide-react';
import { CATEGORY_CONFIG } from '@/lib/constants';
import type { Alert } from '../types';

interface AlertTelemetryProps {
  alert: Alert;
}

const JsonNode = ({ data, isLast }: { data: any; isLast: boolean }) => {
  if (typeof data === 'string') return <><span className="text-green-400">"{data}"</span>{isLast ? '' : ','}</>;
  if (typeof data === 'number') return <><span className="text-orange-400">{data}</span>{isLast ? '' : ','}</>;
  if (typeof data === 'boolean') return <><span className="text-purple-400">{data ? 'true' : 'false'}</span>{isLast ? '' : ','}</>;
  if (data === null) return <><span className="text-zinc-500">null</span>{isLast ? '' : ','}</>;
  
  if (Array.isArray(data)) {
    if (data.length === 0) return <><span className="text-zinc-300">[]</span>{isLast ? '' : ','}</>;
    return (
      <span className="text-zinc-300">
        [
        <div className="pl-4 border-l border-zinc-700/50 ml-1.5 my-1">
          {data.map((val, i) => (
            <div key={i}><JsonNode data={val} isLast={i === data.length - 1} /></div>
          ))}
        </div>
        ]{isLast ? '' : ','}
      </span>
    );
  }
  
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <><span className="text-zinc-300">{"{}"}</span>{isLast ? '' : ','}</>;
    return (
      <span className="text-zinc-300">
        {"{"}
        <div className="pl-4 border-l border-zinc-700/50 ml-1.5 my-1">
          {keys.map((key, i) => (
            <div key={key}>
              <span className="text-blue-400">"{key}"</span>: <JsonNode data={data[key]} isLast={i === keys.length - 1} />
            </div>
          ))}
        </div>
        {"}"}{isLast ? '' : ','}
      </span>
    );
  }
  
  return null;
};

export function AlertTelemetry({ alert }: AlertTelemetryProps) {
  return (
    <div className="space-y-6">
      {/* Telemetry Metadata Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>
            <Server className="h-4 w-4 text-primary" />
            Incident Source Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
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
              {CATEGORY_CONFIG[alert.category as keyof typeof CATEGORY_CONFIG]?.label || alert.category}
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
      <Card className="overflow-hidden">
        <details className="group [&_summary::-webkit-details-marker]:hidden bg-zinc-950">
          <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold hover:bg-zinc-900 transition-colors border-b border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-100 text-sm">
              <Terminal className="h-4 w-4 text-emerald-500" />
              Raw Event Telemetry JSON
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                <FileCode className="h-3 w-3" />
                SIEM STREAM
              </div>
              <ChevronDown className="h-4 w-4 transition duration-300 group-open:-rotate-180 text-zinc-400" />
            </div>
          </summary>
          <div className="p-5 max-h-[500px] overflow-auto">
            <pre className="text-xs font-mono text-zinc-300 leading-relaxed selection:bg-primary/20 selection:text-primary">
              <JsonNode data={alert.rawEvent} isLast={true} />
            </pre>
          </div>
        </details>
      </Card>
    </div>
  );
}
