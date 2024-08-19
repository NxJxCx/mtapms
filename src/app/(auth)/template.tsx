'use client';;
import { LoadingFull } from "@app/components/loadings";
import { useSession } from "@app/lib/useSession";
import { Roles } from "@app/types";
import { redirect } from "next/navigation";

export default function Template({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status, role } = useSession({
    redirect: false
  });

  if (status === 'loading') return <LoadingFull />;
  return status === 'unauthenticated' ? children : redirect('/' + (role === Roles.Applicant ? 'announcements' : role));
}