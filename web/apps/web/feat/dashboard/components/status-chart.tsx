import React from 'react';
import { Card, Skeleton } from '@workspace/ui';
import { BarChart3 } from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltip, STATUS_COLORS } from './shared';

interface StatusChartProps {
  isLoading: boolean;
  mounted: boolean;
  statusDistribution: { name: string; value: number }[];
  handleDeepLink: (type: string, value: string) => void;
}

export function StatusChart({
  isLoading,
  mounted,
  statusDistribution,
  handleDeepLink,
}: StatusChartProps) {
  return (
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
  );
}
