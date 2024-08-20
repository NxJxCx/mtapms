import { StatisticNumbers } from "@app/components/dashboard";
import { EllipsisHorizontalIcon, UsersIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { Montserrat, Outfit } from "next/font/google";
import { useMemo } from "react";
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "600", "700"],  })
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700"] })

export default function AdminDashboardComponent() {
  const statisticNumbers = useMemo(() => [
    {
      title: "Total Scholar",
      value: 89935,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    },
    {
      title: "Total Graduates",
      value: 23283,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    },
    {
      title: "Total Users",
      value: 46827,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    },
    {
      title: "Total Refunded",
      value: 124854,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    }
  ], [])
  return (
    <div className={clsx("p-4", outfit.className)}>
      <StatisticNumbers items={statisticNumbers} className={clsx("mb-3", outfit.className)} />
      <div className="flex flex-wrap mb-4 xl:gap-x-4 gap-y-4 xl:space-y-0">
        <div className="flex-grow rounded-lg bg-white border p-4">
          <div className="flex justify-between gap-x-4">
            <h2 className="font-[500] text-[20px] leading-[30px]">
              Scholar Analytics
            </h2>
            <div className="border rounded bg-white px-3 py-1">
              <select title="Analytics Data By" className="font-[400] text-[12px] leading-[18px] bg-white">
                <option value="monthly">
                  Monthly
                </option>
                <option value="yearly">
                  Yearly
                </option>
              </select>
            </div>
          </div>
          <div className="min-w-[700px] min-h-[250px]">
            {/* some charts here */}
          </div>
        </div>
        <div className="rounded-lg p-4 border flex flex-col flex-grow max-w-[400px] min-w-[300px] min-h-[300px] bg-white">
          <div className="flex justify-between">
            <h2 className="flex-grow font-[500] text-[20px] leading-[30px]">
              Examination
            </h2>
            <button type="button" title="List">
              <EllipsisHorizontalIcon className="w-[20px] h-[20px] aspect-square" />
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center">
            {/* some charts here */}
          </div>
          <div className="flex-shrink flex justify-between flex-nowrap">
            <div>
              <div className="flex flex-nowrap">
                <div className="pr-2 flex items-center">
                  <div className="rounded-full aspect-square h-2 bg-green-500" />
                </div>
                <span className="text-green-500 text-[14px] font-[400] leading-[18px]">Passing</span>
              </div>
            </div>
            <div>
              <div className="flex flex-nowrap">
                <div className="pr-2 flex items-center">
                  <div className="rounded-full aspect-square h-2 bg-green-500" />
                </div>
                <span className="text-green-500 text-[14px] font-[400] leading-[18px]">Passing</span>
              </div>
            </div>
            <div>
              <div className="flex flex-nowrap">
                <div className="pr-2 flex items-center">
                  <div className="rounded-full aspect-square h-2 bg-green-500" />
                </div>
                <span className="text-green-500 text-[14px] font-[400] leading-[18px]">Passing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={clsx("flex flex-wrap gap-x-8 gap-y-4", montserrat.className)}>
        <div className="rounded-lg min-h-[300px] max-h-[300px] min-w-[400px] border border-black shadow bg-white">
          <div className="rounded-t-lg py-2 bg-[#2D2D2D] text-white text-center font-[700] text-[17px] leading-[29.5px] flex justify-center items-center">
            Announcement
          </div>
          <div className="rounded-b-lg p-4 flex flex-col items-start font-[500] text-[11px] leading-[20.5px] max-h-[250px] overflow-auto">
            <p>Lurem</p>
            <p>Espon</p>
            <p>Lurem</p>
            <p>Espon</p>
            <p>Lurem</p>
            <p>Espon</p>
            <p>Lurem</p>
            <p>Espon</p>
            <p>Lurem</p>
            <p>Espon</p>
            <p>Lurem</p>
            <p>Espon</p>
            <p>Lurem</p>
            <p>Espon</p>
          </div>
        </div>
        <div className="rounded-lg min-h-[300px] max-h-[300px] min-w-[400px] border border-black shadow bg-white">
          <div className="rounded-t-lg py-2 bg-[#2D2D2D] text-white text-center font-[700] text-[17px] leading-[29.5px] flex justify-center items-center">
            Announcement
          </div>
          <div className="rounded-b-lg p-4 flex flex-col items-start font-[500] text-[11px] leading-[20.5px] max-h-[250px] overflow-auto">
            <p>Lurem</p>
            <p>Espon</p>
          </div>
        </div>
        <div className="rounded-lg min-h-[300px] max-h-[300px] min-w-[400px] border border-black shadow bg-white">
          <div className="rounded-t-lg py-2 bg-[#2D2D2D] text-white text-center font-[700] text-[17px] leading-[29.5px] flex justify-center items-center">
            Announcement
          </div>
          <div className="rounded-b-lg p-4 flex flex-col items-start font-[500] text-[11px] leading-[20.5px] max-h-[250px] overflow-auto">
            <p>Lurem</p>
            <p>Espon</p>
          </div>
        </div>
      </div>
    </div>
  )
}