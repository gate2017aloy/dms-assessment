import React from 'react';
import { Dashboard } from '@/feat/dashboard';
import { NextPageProps } from '@/types';

export default async function DashboardPage(props: NextPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return <Dashboard params={params} searchParams={searchParams} />;
}
