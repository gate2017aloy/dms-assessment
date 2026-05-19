import React from 'react';
import { Card, Skeleton } from '@workspace/ui';
import { Layers } from 'lucide-react';
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
import { CustomTooltip, CATEGORY_COLORS } from './shared';

interface CategoryChartProps {
  isLoading: boolean;
  mounted: boolean;
  categoryDistribution: { name: string; value: number }[];
  handleDeepLink: (type: string, value: string) => void;
}

export function CategoryChart({
  isLoading,
  mounted,
  categoryDistribution,
  handleDeepLink,
}: CategoryChartProps) {
  return (
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
  );
}
