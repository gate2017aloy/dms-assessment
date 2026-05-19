import { Alerts } from '@feat/alerts';

interface PageProps {
  params: Promise<any>;
  searchParams: Promise<any>;
}

export default async function AlertsPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  return <Alerts params={params} searchParams={searchParams} />;
}
