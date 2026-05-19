/**
 * Shared type definitions for the DMS Assessment project.
 * These are self-contained string union types that decouple the frontend
 * from @prisma/client, preventing build issues on platforms like Vercel.
 */

export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type Status = 'new' | 'investigating' | 'resolved' | 'false_positive';
export type Category = 'malware' | 'phishing' | 'unauthorized_access' | 'data_exfiltration' | 'policy_violation' | 'suspicious_login';

export interface Alert {
  id: string;
  timestamp: string;
  title: string;
  severity: Severity;
  status: Status;
  category: Category;
  source: string;
  affectedAsset: string;
  assignee: string | null;
  description: string;
  rawEvent: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface NextPageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}
