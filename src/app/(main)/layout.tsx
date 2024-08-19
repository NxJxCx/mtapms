import { SidebarProvider } from "@app/components/sidebar";
import { SessionProvider } from "@app/lib/useSession";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </SessionProvider>
  )
}