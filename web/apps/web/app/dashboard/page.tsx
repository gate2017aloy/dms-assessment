import React from 'react';
import { Dashboard } from '@/feat/dashboard';

interface PageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}

export default async function DashboardPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return <Dashboard params={params} searchParams={searchParams} />;
}
