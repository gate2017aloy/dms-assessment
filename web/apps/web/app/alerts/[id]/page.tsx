import { AlertDetail } from '@feat/alerts/detail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlertDetailPage(props: PageProps) {
  const params = await props.params;
  return <AlertDetail id={params.id} />;
}
