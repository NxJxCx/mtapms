'use client';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
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
        <div className="hidden md:block flex-grow text-[16px] font-400 leading-[36px] text-center mt-4">
          MUNICIPAL TERTIARY ASSISTANCE PROGRAM MANAGEMENT SYSTEM
        </div>
      </header>
      <div className="p-2 h-[700px]">
        {children}
      </div>
    </main>
  )
}