'use client'

import { StatisticNumbers } from "@app/components/dashboard";
import { UsersIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { Montserrat, Outfit } from "next/font/google";
import { useEffect, useState } from "react";
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "600", "700"],  })

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700"] })

function Charts(props: any) {
  return (
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
          
        </div>
      </div>
      {/* <div className="rounded-lg p-4 border flex flex-col flex-grow max-w-[400px] min-w-[300px] min-h-[300px] bg-white">
        <div className="flex justify-between">
          <h2 className="flex-grow font-[500] text-[20px] leading-[30px]">
            Examination
          </h2>
          <button type="button" title="List">
            <EllipsisHorizontalIcon className="w-[20px] h-[20px] aspect-square" />
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          
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
      </div> */}
    </div>
  )
}

export default function AdminDashboardComponent() {
  const [statisticNumbers, setStatisticNumbers] = useState<{title: string, value: number, icon: JSX.Element }[]>([
    {
      title: "Total Scholar",
      value: 0,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    },
    {
      title: "Total Graduates",
      value: 0,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    },
    {
      title: "Current No. of Applicants",
      value: 0,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    },
    {
      title: "Total No. of Users",
      value: 0,
      icon: <UsersIcon className="h-[20px] w-[20px]" />
    },
  ])

  const fetchDataDashboard = () => {
    const url = new URL('/api/admin/dashboard', window.location.origin)
    fetch(url)
      .then(resp => resp.json())
      .then(({ data }) => setStatisticNumbers([
        {
          title: "Total Scholar",
          value: data.totalScholars || 0,
          icon: <UsersIcon className="h-[20px] w-[20px]" />
        },
        {
          title: "Total Graduates",
          value: data.totalGraduates || 0,
          icon: <UsersIcon className="h-[20px] w-[20px]" />
        },
        {
          title: "Current No. of Applicants",
          value: data.totalApplicants,
          icon: <UsersIcon className="h-[20px] w-[20px]" />
        },
        {
          title: "Total No. of Users",
          value: data.totalUsers || 0,
          icon: <UsersIcon className="h-[20px] w-[20px]" />
        },
      ]))
  }

  useEffect(() => {
    fetchDataDashboard()
  }, [])

  return (
    <div className={clsx("p-4", outfit.className)}>
      <StatisticNumbers items={statisticNumbers} className={clsx("mb-3", outfit.className)} />
      <Charts />
    </div>
  )
}