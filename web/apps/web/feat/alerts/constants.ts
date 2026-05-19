import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import type { ElementType } from 'react';

export interface SeverityStyle {
  bg: string;
  label: string;
  icon: ElementType;
}

export interface StatusStyle {
  bg: string;
  label: string;
}

export const severityConfig: Record<'critical' | 'high' | 'medium' | 'low' | 'info', SeverityStyle> = {
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

export const statusConfig: Record<'new' | 'investigating' | 'resolved' | 'false_positive', StatusStyle> = {
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

export const categoryLabels: Record<string, string> = {
  malware: 'Malware',
  phishing: 'Phishing',
  unauthorized_access: 'Unauthorized Access',
  data_exfiltration: 'Data Exfiltration',
  policy_violation: 'Policy Violation',
  suspicious_login: 'Suspicious Login',
};
