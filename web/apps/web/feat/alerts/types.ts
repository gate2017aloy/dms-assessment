export interface Alert {
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
  rawEvent?: any;
}

export interface AlertsApiResponse {
  data: Alert[];
  total: number;
  page: number;
  pages: number;
}

export interface AlertsFilterState {
  page: number;
  severity: string;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  search: string;
  sort: 'timestamp_desc' | 'timestamp_asc' | 'severity_desc' | 'severity_asc';
}
