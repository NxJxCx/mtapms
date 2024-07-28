'use client';
import { Roles } from "@app/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

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
      label: "Applications",
      href: "/admin/applications",
    },
    {
      label: "Student Status",
      href: "/admin/status",
    },
    {
      label: "Schedule",
      href: "/admin/schedule",
    },
    {
      label: "Results",
      href: "/admin/results",
    },
    {
      label: "Results Ranking",
      href: "/admin/ranking",
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
      label: "Submission Status",
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
      label: "Scholar Status",
      href: "/grantee/status",
    },
    {
      label: "Scholar Profile",
      href: "/grantee/profile",
    },
    {
      label: "Account Settings",
      href: "/grantee/settings",
    }
  ],
  'none': []
}

export function SidebarComponent({
  role: myRole,
  defaultOpenDrawer,
}: Readonly<{
  role: Roles;
  defaultOpenDrawer?: boolean;
}>) {
  const pathname = usePathname()
  const { role, setRole, toggleDrawer, openDrawer, setOpenDrawer } = useSidebar({ role: myRole, defaultOpenDrawer })
  const [hiddenClass, sethiddenClass] = useState("left-0");

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
        <h2 className="font-[700] text-[15px] leading-[36px] text-center text-[#1D1D1D] pb-2">REGINALD S. LASPINAS</h2>
        <div className="w-[81px] bg-[gold] capitalize font-[500] leading-[36px] text-[14px] rounded-2xl text-center mx-auto">{role}</div>
        <div className="h-[16px]" />
        <div className="min-h-[100px]">
          {/* sidebar links here */}
          { sidebarLinks[role || 'none'].map(({ label, href }, index) => (
            <div
              key={index}
              className={
                clsx(
                  "block w-[240px] ml-2 px-6 py-4 font-[700] text-[16px] hover:text-[#1D1D1D]",
                  "cursor-pointer",
                  pathname.startsWith(href) ? "text-[#00823E] border-l-[#00823E] border-l-4 rounded " : "text-[#1D1D1D]/50"
                )
              }
              >
              <Link href={href}>
                {label}
              </Link>
            </div>
          ))}
        </div>
        <div className="mx-auto text-center mt-6 hover:text-red-800 hover:font-semibold hover:underline">
          <Link href="/logout">
            <span className="inline-flex w-[24px] h-[24px] aspect-square rounded-full bg-[#00823E] p-[6.5px] items-center justify-center">
              <Image src="/logout-icon.svg" alt="Log Out" width={24} height={24} priority={true} />
            </span>
            <span className="pl-1">Log Out</span>
          </Link>
        </div>
        <div className="mt-6 w-full h-[1px]" />
      </div>
    </aside>
  )
}