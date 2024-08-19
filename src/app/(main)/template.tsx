'use client';;
import { LoadingFull } from "@app/components/loadings";
import { useSession } from "@app/lib/useSession";

export default function Template({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: sessionData, status } = useSession({
    redirect: true
  });

  if (status === 'loading') return <LoadingFull />;

  return status === 'authenticated' ? children : null;
}