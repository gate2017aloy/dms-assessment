import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@workspace/ui';
import { User, Activity, Loader2, UserCheck } from 'lucide-react';
import type { Alert } from '../types';

interface AlertTriagePanelProps {
  alert: Alert;
  isUpdating: boolean;
  handleTriageUpdate: (field: string, value: any) => void;
  handleAssignToMe: () => void;
  handleUnassign: () => void;
}

export function AlertTriagePanel({
  alert,
  isUpdating,
  handleTriageUpdate,
  handleAssignToMe,
  handleUnassign,
}: AlertTriagePanelProps) {
  return (
    <div className="space-y-6">
      {/* Analyst Assignment Card */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>
            <User className="h-4 w-4 text-primary" />
            Incident Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-1">
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
                disabled={isUpdating}
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
                disabled={isUpdating}
                className="w-full text-xs font-semibold rounded-lg h-9 gap-1.5"
              >
                {isUpdating ? (
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
      <Card>
        <CardHeader className="border-b">
          <CardTitle>
            <Activity className="h-4 w-4 text-primary" />
            SIEM Triage Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-1">
          
          {/* Status Update Trigger */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Triage Status</label>
            <Select
              value={alert.status}
              onValueChange={(val) => handleTriageUpdate('status', val)}
              disabled={isUpdating}
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
              disabled={isUpdating}
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
  );
}
