'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Skeleton
} from '@workspace/ui';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  Activity,
  Terminal,
  Server,
  User,
  Clock,
  UserCheck,
  Loader2,
  FileCode,
  Tag
} from 'lucide-react';

interface Alert {
  id: string;
  timestamp: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  category: string;
  source: string;
  affectedAsset: string;
  assignee: string | null;
  description: string;
  rawEvent: any;
}

// Curated styling for severity
const severityConfig = {
  critical: {
    bg: 'bg-red-500/10 text-red-500 border-red-500/20 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30',
    label: 'Critical',
    icon: ShieldAlert
  },
  high: {
    bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30',
    label: 'High',
    icon: AlertTriangle
  },
  medium: {
    bg: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/30',
    label: 'Medium',
    icon: AlertTriangle
  },
  low: {
    bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    label: 'Low',
    icon: Info
  },
  info: {
    bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30',
    label: 'Info',
    icon: Info
  },
};

// Curated styling for status
const statusConfig = {
  new: {
    bg: 'bg-violet-500/10 text-violet-500 border-violet-500/20 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/30',
    label: 'New'
  },
  investigating: {
    bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    label: 'Investigating'
  },
  resolved: {
    bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
    label: 'Resolved'
  },
  false_positive: {
    bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30',
    label: 'False Positive'
  },
};

const categoryLabels: Record<string, string> = {
  malware: 'Malware',
  phishing: 'Phishing',
  unauthorized_access: 'Unauthorized Access',
  data_exfiltration: 'Data Exfiltration',
  policy_violation: 'Policy Violation',
  suspicious_login: 'Suspicious Login',
};

export function AlertDetail({ id }: { id: string }) {
  const router = useRouter();
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Fetch the detailed alert data
  const { data: alert, isLoading, isError, refetch } = useQuery<Alert>({
    queryKey: ['alert', id],
    queryFn: async () => {
      const response = await axios.get(`/api/alerts/${id}`);
      return response.data;
    }
  });

  // Triage state updates mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<Alert>) => {
      const response = await axios.patch(`/api/alerts/${id}`, payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      refetch();
      const updatedField = Object.keys(variables)[0];
      setSuccessFeedback(`Successfully updated ${updatedField}!`);
      setTimeout(() => setSuccessFeedback(null), 3000);
    },
    onError: (err) => {
      console.error('Update failed:', err);
    }
  });

  if (isLoading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-9 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !alert) {
    return (
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center space-y-6">
        <div className="rounded-full bg-red-500/10 p-4 text-red-500 ring-1 ring-red-500/20 w-fit mx-auto">
          <ShieldAlert className="h-8 w-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Incident Log Not Found</h2>
          <p className="text-sm text-muted-foreground">The incident hash does not exist or may have been consolidated.</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/alerts')} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Return to Incidents Deck
        </Button>
      </main>
    );
  }

  const severity = alert.severity;
  const status = alert.status;
  const cfg = severityConfig[severity] || severityConfig.info;
  const IconComponent = cfg.icon;

  const handleTriageUpdate = (field: string, value: any) => {
    updateMutation.mutate({ [field]: value });
  };

  const handleAssignToMe = () => {
    handleTriageUpdate('assignee', 'SOC Analyst');
  };

  const handleUnassign = () => {
    handleTriageUpdate('assignee', null);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Breadcrumb and Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/alerts')}
          className="gap-1.5 px-3 py-1.5 hover:bg-muted/60 transition-all text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Alerts List
        </Button>

        {successFeedback && (
          <div className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-md animate-fade-in">
            {successFeedback}
          </div>
        )}
      </div>

      {/* Incident Header */}
      <div className="border-b border-border/40 pb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cfg.bg}`}>
            <IconComponent className="h-3 w-3" />
            {cfg.label} Priority
          </span>
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${statusConfig[status]?.bg}`}>
            Status: {statusConfig[status]?.label}
          </span>
          <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded border border-border/20">
            ID: {alert.id}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {alert.title}
        </h1>
        
        <p className="text-sm text-muted-foreground max-w-4xl">
          {alert.description}
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Left Columns - Telemetry Details & Raw Events */}
        <div className="lg:col-span-2 space-y-6">
          
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

        {/* Right Column - Interactive Triage Action controls */}
        <div className="space-y-6">
          
          {/* Analyst Assignment Card */}
          <Card className="bg-card/25 border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/30 px-5 py-4">
              <CardTitle className="text-sm font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Incident Ownership
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {alert.assignee ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-accent/40 border border-border/30">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                      SA
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs text-muted-foreground">Assigned Analyst</div>
                      <div className="text-sm font-semibold text-foreground">{alert.assignee}</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnassign}
                    disabled={updateMutation.isPending}
                    className="w-full text-xs font-semibold text-red-500 hover:text-red-400 hover:bg-red-500/10 border-border/60 rounded-lg h-9"
                  >
                    Unassign Incident
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-center italic">
                    This incident is currently unassigned and queued.
                  </div>
                  <Button
                    onClick={handleAssignToMe}
                    disabled={updateMutation.isPending}
                    className="w-full text-xs font-semibold rounded-lg h-9 gap-1.5"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    Assign to Me
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Incident Triage Action Card */}
          <Card className="bg-card/25 border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/30 px-5 py-4">
              <CardTitle className="text-sm font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                SIEM Triage Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              
              {/* Status Update Trigger */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Triage Status</label>
                <Select
                  value={alert.status}
                  onValueChange={(val) => handleTriageUpdate('status', val)}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className="w-full bg-background/50 border-border/60 rounded-lg h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New / Unaddressed</SelectItem>
                    <SelectItem value="investigating">Active Investigation</SelectItem>
                    <SelectItem value="resolved">Resolved / Mitigated</SelectItem>
                    <SelectItem value="false_positive">False Positive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Severity Update Trigger */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Severity Classification</label>
                <Select
                  value={alert.severity}
                  onValueChange={(val) => handleTriageUpdate('severity', val)}
                  disabled={updateMutation.isPending}
                >
                  <SelectTrigger className="w-full bg-background/50 border-border/60 rounded-lg h-9">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="info">Info / Informational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
