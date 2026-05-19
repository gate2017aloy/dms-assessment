import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import type { ElementType } from 'react';
import { Severity, Status, Category } from '@/types';

export interface SeverityStyle {
  bg: string;
  label: string;
  icon: ElementType;
  colorHex: string;
}

export interface StatusStyle {
  bg: string;
  label: string;
  colorHex: string;
}

export interface CategoryStyle {
  label: string;
  colorHex: string;
}

export const SEVERITY_CONFIG: Record<Severity, SeverityStyle> = {
  critical: {
    bg: 'bg-red-500/10 text-red-500 border-red-500/20 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30',
    label: 'Critical',
    icon: ShieldAlert,
    colorHex: '#ef4444',
  },
  high: {
    bg: 'bg-orange-500/10 text-orange-500 border-orange-500/20 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30',
    label: 'High',
    icon: AlertTriangle,
    colorHex: '#f97316',
  },
  medium: {
    bg: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/30',
    label: 'Medium',
    icon: AlertTriangle,
    colorHex: '#eab308',
  },
  low: {
    bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    label: 'Low',
    icon: Info,
    colorHex: '#3b82f6',
  },
  info: {
    bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30',
    label: 'Info',
    icon: Info,
    colorHex: '#64748b',
  },
};

export const STATUS_CONFIG: Record<Status, StatusStyle> = {
  new: {
    bg: 'bg-violet-500/10 text-violet-500 border-violet-500/20 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/30',
    label: 'New',
    colorHex: '#f43f5e',
  },
  investigating: {
    bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    label: 'Investigating',
    colorHex: '#f59e0b',
  },
  resolved: {
    bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
    label: 'Resolved',
    colorHex: '#10b981',
  },
  false_positive: {
    bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30',
    label: 'False Positive',
    colorHex: '#64748b',
  },
};

export const CATEGORY_CONFIG: Record<Category, CategoryStyle> = {
  malware: { label: 'Malware', colorHex: '#ec4899' },
  phishing: { label: 'Phishing', colorHex: '#8b5cf6' },
  unauthorized_access: { label: 'Unauthorized Access', colorHex: '#3b82f6' },
  data_exfiltration: { label: 'Data Exfiltration', colorHex: '#f43f5e' },
  policy_violation: { label: 'Policy Violation', colorHex: '#14b8a6' },
  suspicious_login: { label: 'Suspicious Login', colorHex: '#f59e0b' },
};
