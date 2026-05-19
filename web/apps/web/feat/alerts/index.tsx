'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Skeleton
} from '@workspace/ui';
import {
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
  RotateCcw,
  Calendar,
  Filter,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  Activity,
  UserCheck,
  Clock
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
}

interface AlertsApiResponse {
  data: Alert[];
  total: number;
  page: number;
  pages: number;
}

// Curated colors for Severity Badges
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

// Curated colors for Status Badges
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

const columnHelper = createColumnHelper<Alert>();

interface AlertsProps {
  params?: any;
  searchParams?: any;
}

export function Alerts({ params, searchParams }: AlertsProps) {
  const router = useRouter();

  // State filters driven by user actions
  const [filters, setFilters] = useState({
    page: 1,
    severity: 'all',
    status: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
    search: '',
    sort: 'timestamp_desc' as 'timestamp_desc' | 'timestamp_asc' | 'severity_desc' | 'severity_asc'
  });

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState('');

  // Handle live debounced search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Query alerts from server endpoint
  const { data, isLoading, isError, refetch } = useQuery<AlertsApiResponse>({
    queryKey: ['alerts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', filters.page.toString());
      params.append('limit', '15'); // Show 15 alerts per page for great layout structure
      
      if (filters.severity && filters.severity !== 'all') {
        params.append('severity', filters.severity);
      }
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      params.append('sort', filters.sort);

      const response = await axios.get('/api/alerts', { params });
      return response.data;
    },
    placeholderData: (previousData) => previousData, // keep previous page data during fetch to avoid flashing UI
  });

  const alertsList = useMemo(() => data?.data ?? [], [data]);
  const totalAlertsCount = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

  // React Table definition
  const columns = useMemo(() => [
    columnHelper.accessor('severity', {
      header: 'Severity',
      cell: (info) => {
        const val = info.getValue();
        const cfg = severityConfig[val] || severityConfig.info;
        const Icon = cfg.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${cfg.bg}`}>
            <Icon className="h-3 w-3 shrink-0" />
            {cfg.label}
          </span>
        );
      }
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => (
        <div className="max-w-[280px] sm:max-w-[360px] truncate font-medium text-foreground">
          {info.getValue()}
        </div>
      )
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => (
        <span className="text-muted-foreground text-sm font-medium">
          {categoryLabels[info.getValue()] || info.getValue()}
        </span>
      )
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const val = info.getValue();
        const cfg = statusConfig[val] || statusConfig.new;
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${cfg.bg}`}>
            {cfg.label}
          </span>
        );
      }
    }),
    columnHelper.accessor('source', {
      header: 'Source',
      cell: (info) => (
        <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-muted/65 text-muted-foreground border border-border/20">
          {info.getValue()}
        </code>
      )
    }),
    columnHelper.accessor('timestamp', {
      header: 'Timestamp',
      cell: (info) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {new Date(info.getValue()).toLocaleString()}
        </span>
      )
    }),
    columnHelper.accessor('assignee', {
      header: 'Assignee',
      cell: (info) => {
        const val = info.getValue();
        return val ? (
          <span className="inline-flex items-center gap-1 text-xs text-foreground bg-accent/70 px-2 py-0.5 rounded-md border border-border/20 font-medium">
            <UserCheck className="h-3 w-3 text-muted-foreground" />
            {val}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/50 italic">Unassigned</span>
        );
      }
    }),
  ], []);

  const table = useReactTable({
    data: alertsList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const resetFilters = () => {
    setFilters({
      page: 1,
      severity: 'all',
      status: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
      search: '',
      sort: 'timestamp_desc'
    });
    setSearchInput('');
  };

  const handleRowClick = (id: string) => {
    router.push(`/alerts/${id}`);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="gap-1.5 px-3 py-1.5 hover:bg-muted/60 transition-all text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
      </div>

      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text">
            Security Incident Alerts
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Triage system for high-fidelity endpoint alerts, phishing indicators, policy violations, and suspicious network activities.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-card/65 px-4 py-2 rounded-xl border border-border/45 backdrop-blur-md shrink-0">
          <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
          <div className="text-xs font-semibold text-muted-foreground">
            <span className="text-foreground font-bold tabular-nums text-sm mr-1">
              {totalAlertsCount.toLocaleString()}
            </span>
            Total Incidents
          </div>
        </div>
      </div>

      {/* Triage Dashboard Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Critical Priority</p>
              <h3 className="text-2xl font-bold text-red-500 tabular-nums">
                {isLoading ? <Skeleton className="h-7 w-12" /> : (filters.severity === 'critical' || filters.severity === 'all' ? totalAlertsCount : 0)}
              </h3>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/15">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unassigned</p>
              <h3 className="text-2xl font-bold text-violet-500 tabular-nums">
                {isLoading ? <Skeleton className="h-7 w-12" /> : alertsList.filter(a => !a.assignee).length}
              </h3>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-500 border border-violet-500/15">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Investigating</p>
              <h3 className="text-2xl font-bold text-amber-500 tabular-nums">
                {isLoading ? <Skeleton className="h-7 w-12" /> : (filters.status === 'investigating' || filters.status === 'all' ? alertsList.filter(a => a.status === 'investigating').length : 0)}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/15">
              <Activity className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/30 border-border/40 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Mitigated</p>
              <h3 className="text-2xl font-bold text-emerald-500 tabular-nums">
                {isLoading ? <Skeleton className="h-7 w-12" /> : (filters.status === 'resolved' || filters.status === 'all' ? alertsList.filter(a => a.status === 'resolved').length : 0)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/15">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elegant Controls and Filters Bar */}
      <Card className="border border-border/30 bg-card/15 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span>INCIDENT FILTERS & TRIAGE CONTROLS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Real-time Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                placeholder="Search incident, source, IP..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 h-9 w-full bg-background/50 border-border/60 hover:bg-background/80 focus:bg-background transition-all rounded-lg"
              />
            </div>

            {/* Severity Select */}
            <div>
              <Select
                value={filters.severity}
                onValueChange={(val) => setFilters(prev => ({ ...prev, severity: val, page: 1 }))}
              >
                <SelectTrigger className="w-full h-9 bg-background/50 border-border/60 rounded-lg">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Select */}
            <div>
              <Select
                value={filters.status}
                onValueChange={(val) => setFilters(prev => ({ ...prev, status: val, page: 1 }))}
              >
                <SelectTrigger className="w-full h-9 bg-background/50 border-border/60 rounded-lg">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="false_positive">False Positive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Select */}
            <div>
              <Select
                value={filters.category}
                onValueChange={(val) => setFilters(prev => ({ ...prev, category: val, page: 1 }))}
              >
                <SelectTrigger className="w-full h-9 bg-background/50 border-border/60 rounded-lg">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reset Button */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-9 w-full gap-1.5 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all rounded-lg text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Controls
              </Button>
            </div>
          </div>

          {/* Premium Date Range Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-3 border-t border-border/25">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/75" />
              <span>Incident Timeline Range:</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Start</span>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value, page: 1 }))}
                  className="h-8 py-1 px-2.5 bg-background/40 border-border/60 rounded-md text-xs w-[140px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">End</span>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value, page: 1 }))}
                  className="h-8 py-1 px-2.5 bg-background/40 border-border/60 rounded-md text-xs w-[140px]"
                />
              </div>

              {(filters.startDate || filters.endDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, startDate: '', endDate: '', page: 1 }))}
                  className="h-7 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2.5 rounded-md"
                >
                  Clear Range
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Alerts Incidents Table */}
      <Card className="border border-border/30 bg-card/30 backdrop-blur-md shadow-lg overflow-hidden">
        <div className="relative">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const isSortable = ['timestamp', 'severity'].includes(header.column.id);
                    return (
                      <TableHead
                        key={header.id}
                        onClick={() => {
                          if (header.column.id === 'timestamp') {
                            setFilters(prev => ({
                              ...prev,
                              sort: prev.sort === 'timestamp_desc' ? 'timestamp_asc' : 'timestamp_desc',
                              page: 1
                            }));
                          } else if (header.column.id === 'severity') {
                            setFilters(prev => ({
                              ...prev,
                              sort: prev.sort === 'severity_desc' ? 'severity_asc' : 'severity_desc',
                              page: 1
                            }));
                          }
                        }}
                        className={`py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground ${
                          isSortable ? 'cursor-pointer select-none hover:bg-muted/65 transition-all text-foreground' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          
                          {header.column.id === 'timestamp' && (
                            filters.sort === 'timestamp_desc' ? (
                              <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : filters.sort === 'timestamp_asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                            )
                          )}

                          {header.column.id === 'severity' && (
                            filters.sort === 'severity_desc' ? (
                              <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : filters.sort === 'severity_asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-primary shrink-0" />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                            )
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Clean skeleton placeholders for loading phase
                Array.from({ length: 8 }).map((_, rIdx) => (
                  <TableRow key={rIdx} className="border-b border-border/25">
                    {Array.from({ length: 7 }).map((_, cIdx) => (
                      <TableCell key={cIdx} className="p-4">
                        <Skeleton className="h-5 w-full max-w-[120px] rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : isError ? (
                // Beautiful full-table error display
                <TableRow>
                  <TableCell colSpan={7} className="h-72 text-center p-6">
                    <div className="flex flex-col items-center justify-center space-y-3.5 max-w-sm mx-auto">
                      <div className="rounded-full bg-red-500/10 p-3 text-red-500 ring-1 ring-red-500/25">
                        <ShieldAlert className="h-6 w-6 animate-bounce" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">Failed to Load Incidents</h4>
                        <p className="text-xs text-muted-foreground">An error occurred while connecting to the SIEM alerts repository API stream.</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetch()}
                        className="gap-1.5 rounded-lg border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Re-connect Stream
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : alertsList.length === 0 ? (
                // Elegant empty state when query returns nothing
                <TableRow>
                  <TableCell colSpan={7} className="h-72 text-center p-6">
                    <div className="flex flex-col items-center justify-center space-y-3.5 max-w-md mx-auto">
                      <div className="rounded-full bg-muted/60 p-3 text-muted-foreground ring-1 ring-border/20">
                        <Filter className="h-6 w-6 text-muted-foreground/60" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">No Incidents Found</h4>
                        <p className="text-xs text-muted-foreground">No telemetry alerts match your current filter parameters or timeline window range.</p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={resetFilters}
                        className="gap-1.5 rounded-lg text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Clear Filter Controls
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // High-performance rows with visual feedbacks
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.original.id)}
                    className="border-b border-border/25 hover:bg-muted/40 cursor-pointer active:bg-muted/60 transition-colors group/row"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dynamic Pagination Footer Control */}
        {!isLoading && !isError && alertsList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-border/30 bg-muted/20">
            <div className="text-xs text-muted-foreground font-semibold">
              Showing page <span className="text-foreground font-bold tabular-nums">{filters.page}</span> of{' '}
              <span className="text-foreground font-bold tabular-nums">{totalPages}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="gap-1.5 h-8 border-border/60 hover:bg-muted/40 rounded-lg text-xs font-semibold"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  // Elegant slide-window for pagination numbers
                  let pageNum = idx + 1;
                  if (filters.page > 3 && totalPages > 5) {
                    pageNum = filters.page - 3 + idx;
                    if (pageNum + (4 - idx) > totalPages) {
                      pageNum = totalPages - 4 + idx;
                    }
                  }
                  
                  return (
                    <Button
                      key={idx}
                      variant={filters.page === pageNum ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                      className={`h-8 w-8 rounded-lg text-xs font-bold ${
                        filters.page === pageNum 
                          ? 'shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === totalPages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="gap-1.5 h-8 border-border/60 hover:bg-muted/40 rounded-lg text-xs font-semibold"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
