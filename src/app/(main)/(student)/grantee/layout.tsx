import { MainContainer } from "@app/components/main";
import { SidebarComponent } from "@app/components/sidebar";
import { Roles } from "@app/types";

export default function GranteeLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarComponent role={Roles.Grantee} />
      <MainContainer>{children}</MainContainer>
    </>
  )
}