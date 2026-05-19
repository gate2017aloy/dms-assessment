import { Alerts } from '@feat/alerts';
import { NextPageProps } from '@/types';

export default async function AlertsPage(props: NextPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return <Alerts params={params} searchParams={searchParams} />;
}
