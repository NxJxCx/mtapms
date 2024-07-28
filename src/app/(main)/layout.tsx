import { SidebarProvider } from "@app/components/sidebar";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}