'use client';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import Image from "next/image";
import { useSidebar } from "./sidebar";

export function MainContainer({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { openDrawer, toggleDrawer } = useSidebar()

  return (
    <main className={
      clsx(
        "relative min-h-screen bg-[#F6FFF1]",
        "transition-[padding-left] ease-in-out duration-300",
        openDrawer ? "md:pl-[265px]" : "pl-0",
      )
    }>
      <header className="flex items-center justify-between p-4 relative">
        <button type="button" className="w-[30px] max-h-[30px] hover:bg-[#00823ECC] hover:text-gray-50 text-[#00823ECC] aspect-square rounded bg-gray-50 shadow  border" onClick={toggleDrawer} title={openDrawer ? "Close Sidebar" : "Open Sidebar"}>
          {openDrawer ? <ChevronLeftIcon fontSize={2} className="w-[30px]" /> : <ChevronRightIcon fontSize={2} className="w-[30px]" />}
        </button>
        <div className="ml-4 flex items-center justify-center space-x-2 flex-grow text-[12px] font-[400] md:text-[16px] md:leading-[36px] md:text-center">
          <div className="md:hidden min-w-[50px] min-h-[50px]">
            <Image src="/buena-logo.svg" alt="Municipal Logo" width={50} height={50} priority={true} />
          </div>
          <div className="max-w-[300px] md:max-w-none">MUNICIPAL TERTIARY ASSISTANCE PROGRAM MANAGEMENT SYSTEM</div>
        </div>
      </header>
      <div className="p-2 h-[700px]">
        {children}
      </div>
    </main>
  )
}