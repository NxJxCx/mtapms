'use client'

import { useCallback, useMemo } from "react";

function AuthTabNav({
  tabs,
  selectedTabIndex,
  children,
}: Readonly<{
  tabs: string[] | React.ReactNode[] | React.ReactElement[] | (string & React.ReactNode & React.ReactElement)[];
  selectedTabIndex: number;
  children: any;
}>) {
  const tab = useMemo(() => tabs[selectedTabIndex], [tabs, selectedTabIndex]);
  const child = useCallback(children?.bind(null, tab, selectedTabIndex), [children, tab, selectedTabIndex]);
  return (
    <div>
      <div className="w-[458px] h-[200px] rounded-[20px] drop-shadow-xl bg-[#F5F5F5]">
        <div className="max-w-full h-full overflow-x-auto">
          <div className="h-[120px] min-w-full *:capitalize *:text-center *:w-full flex flex-row text-[28px] font-[600] leading-[34.13px] text-[#00823E] hover:text-[#005644]">
            {
              tabs.map((item, index) => (
                <button key={index} type="button" className={`w-[150px] h-[50px] ${index === selectedTabIndex ? 'text-gray-500 hover:text-gray-800' : ''}`}>
                  <div className="relative">
                    {item}
                    { index === selectedTabIndex && <div className="absolute left-1/4 -bottom-1/2 w-1/2 h-[7px] bg-[#00823E]" /> }
                  </div>
                </button>
              ))
            }
            <button type="button" className="text-gray-500">
              <div className="relative">
                Student
                <div className="absolute left-1/4 -bottom-1/2 w-1/2 h-[7px] bg-[#00823E]" />
              </div>
            </button>
            <button type="button">
              <div className="relative">
                Admin
                <div className="absolute left-1/4 -bottom-1/2 w-1/2 h-[7px] bg-[#00823E]" />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-[458px] h-[542px] -mt-[78px] bg-white drop-shadow-2xl border rounded-[20px]">
        {child}
      </div>
    </div>
  )
}

const tabs = {
  AuthTabNav,
}

export default tabs