import { MainContainer } from "@app/components/main";
import { SidebarComponent } from "@app/components/sidebar";
import { Roles } from "@app/types";
import StudentIdModal from "./_studentId/component";

export default function GranteeLayout({
  children,
  studentId
}: Readonly<{
  children: React.ReactNode;
  studentId: React.ReactNode;
}>) {
  return (
    <>
      <SidebarComponent role={Roles.Grantee} />
      <MainContainer>{children}</MainContainer>
      <StudentIdModal />
    </>
  )
}