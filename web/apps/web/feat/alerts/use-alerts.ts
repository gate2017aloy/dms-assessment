import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { AlertsFilterState, AlertsApiResponse, Alert } from './types';

export function useAlerts(initialSearchParams?: any) {
  const router = useRouter();

  const searchParamsStr = JSON.stringify(initialSearchParams ?? {});

  // State filters driven by user actions, initialized from URL params if present
  const [filters, setFilters] = useState<AlertsFilterState>(() => {
    const parsed = initialSearchParams ?? {};
    return {
      page: parsed.page ? parseInt(String(parsed.page), 10) : 1,
      severity: parsed.severity ?? 'all',
      status: parsed.status ?? 'all',
      category: parsed.category ?? 'all',
      startDate: parsed.startDate ?? '',
      endDate: parsed.endDate ?? '',
      search: parsed.search ?? '',
      sort: parsed.sort ?? 'timestamp_desc',
    };
  });

  // Local state for debounced search input
  const [searchInput, setSearchInput] = useState(() => filters.search);

  // Sync state if URL params change externally (e.g. from deep-link or browser navigation)
  useEffect(() => {
    const parsed = initialSearchParams ?? {};
    setFilters({
      page: parsed.page ? parseInt(String(parsed.page), 10) : 1,
      severity: parsed.severity ?? 'all',
      status: parsed.status ?? 'all',
      category: parsed.category ?? 'all',
      startDate: parsed.startDate ?? '',
      endDate: parsed.endDate ?? '',
      search: parsed.search ?? '',
      sort: parsed.sort ?? 'timestamp_desc',
    });
    if (parsed.search !== undefined) {
      setSearchInput(parsed.search);
    }
  }, [searchParamsStr]);

  // Sync state to URL params when filters change in UI
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page > 1) params.append('page', filters.page.toString());
    if (filters.severity !== 'all') params.append('severity', filters.severity);
    if (filters.status !== 'all') params.append('status', filters.status);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort !== 'timestamp_desc') params.append('sort', filters.sort);

    const queryString = params.toString();
    const currentQuery = new URLSearchParams(initialSearchParams as Record<string, string>).toString();
    
    if (queryString !== currentQuery) {
      router.push(queryString ? `/alerts?${queryString}` : '/alerts');
    }
  }, [filters, searchParamsStr]);

  // Handle live debounced search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
      }
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

  const resetFilters = () => {
    setFilters({
      page: 1,
      severity: 'all',
      status: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
      search: '',
      sort: 'timestamp_desc',
    });
    setSearchInput('');
  };

  const handleRowClick = (id: string) => {
    router.push(`/alerts/${id}`);
  };

  return {
    filters,
    setFilters,
    searchInput,
    setSearchInput,
    isLoading,
    isError,
    refetch,
    alertsList,
    totalAlertsCount,
    totalPages,
    resetFilters,
    handleRowClick,
  };
}
