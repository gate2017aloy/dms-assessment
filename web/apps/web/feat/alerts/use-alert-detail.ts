'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import type { Alert } from './types';

export function useAlertDetail(id: string) {
  const router = useRouter();
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Fetch the detailed alert data
  const { data: alert, isLoading, isError, refetch } = useQuery<Alert>({
    queryKey: ['alert', id],
    queryFn: async () => {
      const response = await axios.get(`/api/alerts/${id}`);
      return response.data;
    }
  });

  // Triage state updates mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<Alert>) => {
      const response = await axios.patch(`/api/alerts/${id}`, payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      refetch();
      const updatedField = Object.keys(variables)[0];
      setSuccessFeedback(`Successfully updated ${updatedField}!`);
      setTimeout(() => setSuccessFeedback(null), 3000);
    },
    onError: (err) => {
      console.error('Update failed:', err);
    }
  });

  const handleTriageUpdate = (field: keyof Alert | string, value: any) => {
    updateMutation.mutate({ [field]: value });
  };

  const handleAssignToMe = () => {
    handleTriageUpdate('assignee', 'SOC Analyst');
  };

  const handleUnassign = () => {
    handleTriageUpdate('assignee', null);
  };

  const goBack = () => {
    router.push('/alerts');
  };

  return {
    alert,
    isLoading,
    isError,
    successFeedback,
    isUpdating: updateMutation.isPending,
    handleTriageUpdate,
    handleAssignToMe,
    handleUnassign,
    goBack,
  };
}
