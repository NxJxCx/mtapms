import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: 'Login'
}

export default function Home() {
  return (
    <main className="h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#0D41F8]">
      <aside className="relative h-full flex justify-center items-center space-y-8 flex-col">
        <div className="z-0 w-[200px] h-full absolute -right-[100px] top-0 bg-black">
          <div className="relative w-full h-full grid grid-rows-2">
            <div className="bg-[#0D41F8]">
              <div className="absolute left-0 top-0 w-1/2 h-full rounded-br-full bg-[#0D41F8]" />
            </div>
            <div className="bg-[#F6FFF1]">
              <div className="absolute right-0 top-0 w-1/2 h-full rounded-tl-full bg-[#F6FFF1]" />
            </div>
          </div>
        </div>
        <Image src="/buena-logo.svg" alt="Municipal Logo" width={597} height={615} priority />
        <h1 className="uppercase font-[700] leading-[40.23px] text-center text-white text-[33px]">
          MTAP MANAGEMENT SYSTEM
        </h1>
      </aside>
      <section className="h-full relative">
        <div className="absolute left-[100px] top-0 w-full h-full bg-[#F6FFF1]" />
        <div className="h-full w-full flex flex-col items-center justify-center">
          
        </div>
      </section>
    </main>
  );
}
