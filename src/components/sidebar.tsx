'use client';
import { useSession } from "@app/lib/useSession";
import { Roles } from "@app/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LoadingSpinnerFull } from "./loadings";

export interface SidebarContextProps {
  role?: Roles;
  setRole: (role: Roles) => void;
  toggleDrawer: () => void;
  openDrawer?: boolean;
  setOpenDrawer: (openDrawer: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextProps>({
  setRole: () => {},
  toggleDrawer: () => {},
  setOpenDrawer: () => {},
})

export function SidebarProvider({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [role, setRole] = useState<Roles|undefined>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(true);
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  return (
    <SidebarContext.Provider
      value={{
        role,
        setRole,
        openDrawer,
        toggleDrawer,
        setOpenDrawer,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(
  props?: Readonly<{
    role?: Roles;
    defaultOpenDrawer?: boolean;
  }>
) {

  const { role, setRole, toggleDrawer, openDrawer, setOpenDrawer } = useContext(SidebarContext)

  useEffect(() => {
    if (props?.role !== undefined) {
      setRole(props.role);
    }
    if (props?.defaultOpenDrawer !== undefined) {
      setOpenDrawer(props.defaultOpenDrawer);
    }
    // eslint-disable-next-line
  }, [])

  return {
    role,
    setRole,
    toggleDrawer,
    openDrawer,
    setOpenDrawer,
  }
}

const sidebarLinks = {
  [Roles.Admin]: [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Announcements",
      href: "/admin/announcements",
    },
    {
      label: "Application Schedule",
      href: "/admin/schedule",
    },
    {
      label: "Applications",
      href: "/admin/applications",
    },
    {
      label: "Results",
      href: "/admin/results",
    },
    {
      label: "Scholar Information",
      href: "/admin/scholars",
    },
    {
      label: "My Profile",
      href: "/admin/profile",
    },
    {
      label: "Account Settings",
      href: "/admin/settings",
    }
  ],
  [Roles.Applicant]: [
    {
      label: "Announcements",
      href: "/announcements",
    },
    {
      label: "Application Form",
      href: "/application",
    },
    {
      label: "Schedule and Result",
      href: "/schedule",
    },
    {
      label: "Documents",
      href: "/documents",
    },
    {
      label: "Scholarship Status",
      href: "/status",
    },
    {
      label: "My Profile",
      href: "/profile",
    },
    {
      label: "Account Settings",
      href: "/settings",
    }
  ],
  [Roles.Grantee]: [
    {
      label: "Announcements",
      href: "/grantee/announcements",
    },
    {
      label: "Documents",
      href: "/grantee/documents",
    },
    {
      label: "Scholarship Status",
      href: "/grantee/status",
    },
    {
      label: "My Profile",
      href: "/grantee/profile",
    },
    {
      label: "Account Settings",
      href: "/grantee/settings",
    }
  ],
  'none': []
}

function AdminAdditionalSidebar() {
  const pathname = usePathname()
  const [addSidebars, setAddSidebars] = useState<{ label: string, href: string }[]>([])
  const fetchAcademicYear = async () => {
    let additionalSidebars = []
    const url = new URL('/api/schedule/now', window.location.origin)
    const response = await fetch(url)
    if (response.ok) {
      const { data } = await response.json()
      if (!!data) {
        const dateNow = new Date()
        dateNow.setHours(0, 0, 0, 0)
        const orientationDate = new Date(data.orientationDate)
        orientationDate.setHours(0,0,0,0)
        if (dateNow.getTime() === orientationDate.getTime()) {
          additionalSidebars.push({
            label: 'Orientation Attendance',
            href: '/admin/orientation'
          })
        }
        const examDate = new Date(data.examDate)
        examDate.setHours(0,0,0,0)
        if (dateNow.getTime() === examDate.getTime()) {
          additionalSidebars.push({
            label: 'Exam Attendance',
            href: '/admin/exam'
          })
        }
        const interviewDate = new Date(data.interviewDate)
        interviewDate.setHours(0,0,0,0)
        if (dateNow.getTime() === interviewDate.getTime()) {
          additionalSidebars.push({
            label: 'Interview Attendance',
            href: '/admin/interview'
          })
        }
      }
    }
    setAddSidebars(additionalSidebars)
  }

  useEffect(() => {
    fetchAcademicYear()
  }, [])

  return addSidebars.length === 0 ? null : (
    <>
      {addSidebars.map((item, index) => (
        <Link key={index} href={item.href} className={
          clsx(
            "block w-[240px] ml-2 px-6 py-2 font-[700] text-[16px] hover:text-[#1D1D1D]",
            "cursor-pointer",
            pathname.startsWith(item.href) ? "text-[#00823E] border-l-[#00823E] border-l-4 rounded " : "text-[#1D1D1D]/50"
          )
        }>
          {item.label}
        </Link>
      ))}
    </>
  )
}

export function SidebarComponent({
  role: myRole,
  defaultOpenDrawer,
}: Readonly<{
  role: Roles;
  defaultOpenDrawer?: boolean;
}>) {

  const { data: sessionData, status, logout } = useSession({
    redirect: false
  });

  const pathname = usePathname()
  const { role, setRole, toggleDrawer, openDrawer, setOpenDrawer } = useSidebar({ role: myRole, defaultOpenDrawer })
  const [hiddenClass, sethiddenClass] = useState("left-0");
  const fullName = useMemo(() => role === Roles.Admin ? sessionData?.user?.firstName?.toUpperCase() + ' ' + sessionData?.user?.lastName?.toUpperCase() : sessionData?.user?.email, [sessionData, role])

  useEffect(() => {
    if (openDrawer) {
      sethiddenClass("left-0");
    } else {
      setTimeout(() => sethiddenClass("-left-[270px]"), 400)
    }
  }, [openDrawer])

  return (
    <aside
      className={
        clsx(
          "h-screen",
          "transition-[transform] ease-in-out duration-300",
          "fixed top-0 z-50",
          "w-full md:w-[265px] md:max-w-[265px]",
          openDrawer ? "translate-x-[0]" : "-translate-x-[265px]",
          hiddenClass,
        )
      }
    >
      {status === 'loading' && <LoadingSpinnerFull />}
      {status === 'authenticated' && (<>
        <div onClick={toggleDrawer} className={clsx(openDrawer ? "md:hidden absolute w-screen h-screen bg-black/25 cursor-pointer" : "hidden")} />
        <div className="relative w-[265px] max-w-[265px] h-full bg-[#F6FFF1] overflow-x-hidden overflow-h-auto">
          <div className="absolute top-5 right-5">
            <button type="button" className="md:hidden w-[30px] max-h-[30px] hover:bg-[#00823ECC] hover:text-gray-50 text-[#00823ECC] aspect-square rounded bg-gray-50 shadow  border" onClick={toggleDrawer} title={openDrawer ? "Close Sidebar" : "Open Sidebar"}>
              {openDrawer ? <ChevronLeftIcon fontSize={2} className="w-[30px]" /> : <ChevronRightIcon fontSize={2} className="w-[30px]" />}
            </button>
          </div>
          <div className="absolute top-[8%] right-0 w-0 h-[84%] rounded border-[3px] border-[#00823E]/15 z-0" />
          <Image src="/municipal-logo.svg" alt="Municipal Logo" width={85} height={85} priority={true} className="mx-auto py-10 rounded-full" />
          <Image src={"/default-profile.png"} alt="Profile Image" width={100} height={100} loading={"lazy"} className="w-[70px] h-[70px] mx-auto rounded-full aspect-square" />
          <h2 className="font-[700] text-[15px] leading-[36px] text-center text-[#1D1D1D] pb-2">{fullName}</h2>
          <div className="w-[100px] bg-[gold] capitalize font-[500] leading-[36px] text-[14px] rounded-2xl text-center mx-auto">{role}</div>
          <div className="h-[16px]" />
          <div className="min-h-[100px]">
            {/* sidebar links here */}
            { role === Roles.Admin && <AdminAdditionalSidebar />}
            { sidebarLinks[role || 'none'].map(({ label, href }, index) => (
              <Link key={index} href={href} className={
                clsx(
                  "block w-[240px] ml-2 px-6 py-2 font-[700] text-[16px] hover:text-[#1D1D1D]",
                  "cursor-pointer",
                  pathname.startsWith(href) ? "text-[#00823E] border-l-[#00823E] border-l-4 rounded " : "text-[#1D1D1D]/50"
                )
              }>
                {label}
              </Link>
            ))}
          </div>
          <div className="mx-auto text-center mt-6 hover:text-red-800 hover:font-semibold hover:underline">
            <button type="button" onClick={logout}>
              <span className="inline-flex w-[24px] h-[24px] aspect-square rounded-full bg-[#00823E] p-[6.5px] items-center justify-center">
                <Image src="/logout-icon.svg" alt="Log Out" width={24} height={24} priority={true} />
              </span>
              <span className="pl-1">Log Out</span>
            </button>
          </div>
          <div className="mt-6 w-full h-[1px]" />
        </div>
      </>)}
    </aside>
  )
}