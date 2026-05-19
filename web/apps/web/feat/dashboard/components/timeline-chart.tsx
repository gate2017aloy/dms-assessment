import React from 'react';
import { Card, Skeleton } from '@workspace/ui';
import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltip } from './shared';

interface TimelineChartProps {
  isLoading: boolean;
  mounted: boolean;
  alertsOverTime: { date: string; count: number }[];
  handleDeepLink: (type: string, value: string) => void;
}

export function TimelineChart({
  isLoading,
  mounted,
  alertsOverTime,
  handleDeepLink,
}: TimelineChartProps) {
  return (
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
                tickMargin={10}
                minTickGap={60}
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
  );
}
