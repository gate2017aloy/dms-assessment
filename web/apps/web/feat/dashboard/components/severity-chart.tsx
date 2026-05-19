import React from 'react';
import { Card, Skeleton } from '@workspace/ui';
import { PieChart as PieChartIcon } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CustomTooltip, SEVERITY_COLORS } from './shared';

interface SeverityChartProps {
  isLoading: boolean;
  mounted: boolean;
  totalAlerts: number;
  severityDistribution: { name: string; value: number }[];
  handleDeepLink: (type: string, value: string) => void;
}

export function SeverityChart({
  isLoading,
  mounted,
  totalAlerts,
  severityDistribution,
  handleDeepLink,
}: SeverityChartProps) {
  return (
    <Card className="border border-border/40 bg-card/20 backdrop-blur-md shadow-lg p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <PieChartIcon className="h-4.5 w-4.5 text-primary" />
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
  );
}
