import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface DashboardData {
  totalAlerts: number;
  criticalAlerts: number;
  investigatingAlerts: number;
  falsePositives: number;
  severityDistribution: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
  categoryDistribution: { name: string; value: number }[];
  alertsOverTime: { date: string; count: number }[];
}

export function useDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, isError, refetch } = useQuery<DashboardData>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard');
      return response.data;
    },
    refetchInterval: 30000, // Auto-refresh metrics every 30 seconds for live SOC operations
  });

  const handleDeepLink = (type: string, value: string) => {
    let url = '/alerts';
    if (type === 'severity') {
      url = `/alerts?severity=${value}`;
    } else if (type === 'status') {
      url = `/alerts?status=${value}`;
    } else if (type === 'category') {
      url = `/alerts?category=${value}`;
    } else if (type === 'date') {
      // Filter for the entire 24h duration of the selected day
      url = `/alerts?startDate=${value}T00:00:00.000Z&endDate=${value}T23:59:59.999Z`;
    }
    router.push(url);
  };

  return {
    router,
    data,
    isLoading,
    isError,
    refetch,
    mounted,
    handleDeepLink,
    totalAlerts: data?.totalAlerts ?? 0,
    criticalAlerts: data?.criticalAlerts ?? 0,
    investigatingAlerts: data?.investigatingAlerts ?? 0,
    falsePositives: data?.falsePositives ?? 0,
    severityDistribution: data?.severityDistribution ?? [],
    statusDistribution: data?.statusDistribution ?? [],
    categoryDistribution: data?.categoryDistribution ?? [],
    alertsOverTime: data?.alertsOverTime ?? [],
  };
}
