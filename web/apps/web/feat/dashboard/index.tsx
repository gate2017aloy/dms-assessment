'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  Button,
  Skeleton,
} from '@workspace/ui';
import {
  Shield,
  AlertTriangle,
  Activity,
  CheckCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { useDashboard } from './use-dashboard';

// Custom Tooltip component for premium look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover/95 border border-border/50 backdrop-blur-md p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-foreground">{label || payload[0].name}</p>
        <p className="text-primary font-semibold">
          Count: <span className="text-foreground font-mono">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Colors mapping matching the SOC guidelines
const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444', // red-500
  high: '#f97316',    // orange-500
  medium: '#eab308',  // yellow-500
  low: '#3b82f6',     // blue-500
  info: '#64748b',    // slate-500
};

const STATUS_COLORS: Record<string, string> = {
  new: '#f43f5e',           // rose-500
  investigating: '#f59e0b', // amber-500
  resolved: '#10b981',      // emerald-500
  false_positive: '#64748b', // slate-500
};

const CATEGORY_COLORS: Record<string, string> = {
  malware: '#ec4899',             // pink-500
  phishing: '#8b5cf6',            // violet-500
  unauthorized_access: '#3b82f6',  // blue-500
  data_exfiltration: '#f43f5e',   // rose-500
  policy_violation: '#14b8a6',    // teal-500
  suspicious_login: '#f59e0b',     // amber-500
};

interface DashboardProps {
  params?: any;
  searchParams?: any;
}

export function Dashboard({ params, searchParams }: DashboardProps) {
  const {
    router,
    isLoading,
    isError,
    refetch,
    mounted,
    handleDeepLink,
    totalAlerts,
    criticalAlerts,
    investigatingAlerts,
    falsePositives,
    severityDistribution,
    statusDistribution,
    categoryDistribution,
    alertsOverTime,
  } = useDashboard();

  if (isError) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive animate-bounce" />
        <h2 className="text-xl font-bold">Failed to load security metrics</h2>
        <p className="text-muted-foreground">Please check your connection and try again.</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry Connection
        </Button>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/75 bg-clip-text">
            Security Incident Deck
          </h1>
          <p className="text-sm text-muted-foreground">
            Dynamic threat analytics, real-time posture indicators, and interactive telemetry data.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push('/alerts')}
            size="sm"
            className="group gap-2 px-4 shadow-lg hover:shadow-primary/10 transition-all font-semibold"
          >
            Live Alerts Console
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Total Alerts */}
        <Card
          onClick={() => handleDeepLink('all', '')}
          className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-primary/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
              Total Alerts
            </CardDescription>
            <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-all">
              <Shield className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold tracking-tight tabular-nums">
              {isLoading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                totalAlerts.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span>View all system logs</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </p>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card
          onClick={() => handleDeepLink('severity', 'critical')}
          className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-red-500/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-all duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-red-500 transition-colors">
              Critical Alerts
            </CardDescription>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500/20 transition-all">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold tracking-tight text-red-500 tabular-nums">
              {isLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                criticalAlerts.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="group-hover:text-red-400/90 transition-colors">Immediate action required</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-red-400" />
            </p>
          </CardContent>
        </Card>

        {/* Investigating Alerts */}
        <Card
          onClick={() => handleDeepLink('status', 'investigating')}
          className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-amber-500/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-amber-500 transition-colors">
              Investigating
            </CardDescription>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500/20 transition-all">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold tracking-tight text-amber-500 tabular-nums">
              {isLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                investigatingAlerts.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="group-hover:text-amber-400/90 transition-colors">Triage operations active</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-400" />
            </p>
          </CardContent>
        </Card>

        {/* False Positives */}
        <Card
          onClick={() => handleDeepLink('status', 'false_positive')}
          className="group cursor-pointer border border-border/40 bg-card/20 backdrop-blur-md shadow-md hover:border-slate-400/40 hover:bg-card/45 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full blur-xl group-hover:bg-slate-500/10 transition-all duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-slate-300 transition-colors">
              False Positives
            </CardDescription>
            <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400 group-hover:bg-slate-500/20 transition-all">
              <CheckCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-extrabold tracking-tight text-slate-400 tabular-nums">
              {isLoading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                falsePositives.toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="group-hover:text-slate-300/90 transition-colors">Noise reduction telemetry</span>
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: Severity Distribution (Pie/Donut) */}
        <Card className="border border-border/40 bg-card/20 backdrop-blur-md shadow-lg p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Severity Distribution
            </h3>
          </div>
          <div className="h-[280px] w-full flex items-center justify-center relative">
            {!mounted || isLoading ? (
              <Skeleton className="h-[220px] w-[220px] rounded-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={severityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    className="outline-none"
                    cursor="pointer"
                    onClick={(entry) => {
                      if (entry && entry.name) {
                        handleDeepLink('severity', entry.name);
                      }
                    }}
                  >
                    {severityDistribution.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={SEVERITY_COLORS[entry.name] || '#64748b'}
                        className="hover:opacity-85 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span className="text-xs font-semibold capitalize text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {value}
                      </span>
                    )}
                    onClick={(entry) => handleDeepLink('severity', String(entry.value))}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
            {/* Center HUD count */}
            {!isLoading && totalAlerts > 0 && (
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-foreground tabular-nums">
                  {totalAlerts}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  ALERTS
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Chart 2: Status Distribution (Horizontal Bars) */}
        <Card className="border border-border/40 bg-card/20 backdrop-blur-md shadow-lg p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Status Breakdown
            </h3>
          </div>
          <div className="h-[280px] w-full">
            {!mounted || isLoading ? (
              <div className="space-y-4 pt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={statusDistribution}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => val.replace('_', ' ').toUpperCase()}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar
                    dataKey="value"
                    radius={[0, 6, 6, 0]}
                    cursor="pointer"
                    onClick={(entry) => {
                      if (entry && entry.name) {
                        handleDeepLink('status', entry.name);
                      }
                    }}
                  >
                    {statusDistribution.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={STATUS_COLORS[entry.name] || '#64748b'}
                        className="hover:opacity-85 transition-opacity"
                      />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 3: Alerts Over Time (Line / Area Chart) */}
        <Card className="border border-border/40 bg-card/20 backdrop-blur-md shadow-lg p-5 flex flex-col md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Alert Volume Timeline (Last 30 Days)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/15 px-2 py-0.5 rounded-full">
              REAL-TIME FEED
            </span>
          </div>
          <div className="h-[280px] w-full">
            {!mounted || isLoading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={alertsOverTime}
                  margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
                  onClick={(state: any) => {
                    if (state && state.activeLabel) {
                      handleDeepLink('date', state.activeLabel);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={10}
                    tickFormatter={(str) => {
                      try {
                        const date = new Date(str);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      } catch {
                        return str;
                      }
                    }}
                  />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    activeDot={{
                      r: 6,
                      style: { fill: '#6366f1', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' },
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Chart 4: Category Breakdown (Vertical Bar Chart) */}
        <Card className="border border-border/40 bg-card/20 backdrop-blur-md shadow-lg p-5 flex flex-col md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Incident Breakdown by Category
            </h3>
          </div>
          <div className="h-[300px] w-full">
            {!mounted || isLoading ? (
              <div className="flex items-end justify-between h-full pt-8 px-4">
                <Skeleton className="h-[40%] w-[12%]" />
                <Skeleton className="h-[80%] w-[12%]" />
                <Skeleton className="h-[60%] w-[12%]" />
                <Skeleton className="h-[90%] w-[12%]" />
                <Skeleton className="h-[50%] w-[12%]" />
                <Skeleton className="h-[75%] w-[12%]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={categoryDistribution}
                  margin={{ top: 15, right: 10, left: -15, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={9.5}
                    angle={-12}
                    textAnchor="end"
                    interval={0}
                    tickFormatter={(val) => val.replace(/_/g, ' ').toUpperCase()}
                  />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar
                    dataKey="value"
                    radius={[6, 6, 0, 0]}
                    cursor="pointer"
                    onClick={(entry) => {
                      if (entry && entry.name) {
                        handleDeepLink('category', entry.name);
                      }
                    }}
                  >
                    {categoryDistribution.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                        className="hover:opacity-85 transition-opacity"
                      />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Authentication complete / SOC overview footer banner */}
      <Card className="border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-primary">System Monitoring Engine</h3>
          <p className="text-sm text-muted-foreground">
            Operating in <code className="text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded">High Fidelity Triage Mode</code>. Telemetry synchronizes live with system endpoints.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1.5 rounded-xl shrink-0">
          <ShieldCheck className="h-4 w-4" />
          SOC NODE SECURE
        </div>
      </Card>
    </main>
  );
}
