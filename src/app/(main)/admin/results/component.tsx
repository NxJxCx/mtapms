'use client'

import { LoadingSpinnerFull } from "@app/components/loadings";
import Table, { TableColumnProps } from "@app/components/tables";
import { ScheduleModel } from "@app/types";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";

function getRankString(num: number): string {
  if (typeof num !== 'number' || num < 1 || !Number.isInteger(num)) {
      throw new Error('Input must be a positive integer.');
  }
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;
  let suffix: string;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      suffix = 'th';
  } else {
      switch (lastDigit) {
          case 1:
              suffix = 'st';
              break;
          case 2:
              suffix = 'nd';
              break;
          case 3:
              suffix = 'rd';
              break;
          default:
              suffix = 'th';
              break;
      }
  }
  return `${num}${suffix}`;
}

const columns = (): TableColumnProps[] => ([
  {
    label: 'Rank',
    field: 'rank',
    sortable: true,
    searchable: true,
    align: 'center',
    render(rowData: any) {
      return getRankString(rowData.rank)
    }
  },
  {
    label: 'Orientation (10%)',
    field: 'orientationPercentage',
    sortable: true,
    searchable: true,
    align: 'center',
    render(rowData: any) {
      return `${rowData.orientationPercentage} %`
    }
  },
  {
    label: 'Examination (40%)',
    field: 'examPercentage',
    sortable: true,
    searchable: true,
    align: 'center',
    render(rowData: any) {
      return `${rowData.examPercentage} %`
    }
  },
  {
    label: 'Submitted Documents (50%)',
    field: 'submittedDocumentsPercentage',
    sortable: true,
    searchable: true,
    align: 'center',
    render(rowData: any) {
      return `${rowData.submittedDocumentsPercentage} %`
    }
  },
  {
    label: 'Overall Percentage (100%)',
    field: 'overallPercentage',
    sortable: true,
    searchable: true,
    align: 'center',
    render(rowData: any) {
      return rowData.overallPercentage < 75
      ? <button type="button" className="font-bold text-green-700 px-2 py-1 rounded-lg bg-green-50 border shadow shadow-green-100 hover:bg-green-100">{rowData.overallPercentage} %</button>
      : <span className="font-bold text-red-600">{rowData.overallPercentage} %</span>
    }
  },
  {
    label: 'Grantee',
    field: 'grantee',
    sortable: true,
    searchable: true,
    align: 'center',
    render(rowData: any) {
      return <span className={clsx("font-bold", rowData.grantee ? 'text-green-600' : 'text-gray-500')}>{rowData.grantee ? 'Yes' : 'No'}</span>
    }
  },
  {
    label: 'Student ID',
    field: 'studentId',
    sortable: true,
    searchable: true,
  },
  {
    label: 'Full Name',
    field: 'fullName',
    sortable: true,
    searchable: true
  },
  {
    label: 'Year Level',
    field: 'yearLevel',
    sortable: true,
    searchable: true,
    align: 'center',
    render(rowData: any) {
      return rowData.yearLevel === 1
        ? '1st Year'
        : rowData.yearLevel === 2
        ? '2nd Year'
        : rowData.yearLevel === 3
        ? '3rd Year'
        : rowData.yearLevel === 4
        ? '4th Year'
        : undefined
    }
  },
  {
    label: 'Course',
    field: 'course',
    sortable: true,
    searchable: true
  },
  {
    label: 'School',
    field: 'nameOfSchoolAttended',
    sortable: true,
    searchable: true
  },
  {
    label: 'Orientation',
    field: 'orientation',
    sortable: true,
    align: 'center',
    render(rowData: any) {
      return rowData.orientation
        ? 'Yes'
        : 'No'
    }
  },
  {
    label: 'Examination',
    field: 'exam',
    sortable: true,
    align: 'center',
    render(rowData: any) {
      return rowData.exam.toString() !== 'N/A' ? rowData.exam.toString() + '%' : 'N/A'
    }
  },
  {
    label: 'Submitted Documents',
    field: 'submittedDocuments',
    sortable: true,
    align: 'center',
  },
] as TableColumnProps[])

export default function ResultsPage() {
  const [loading, setLoading] = useState(false)
  const [syData, setSYData] = useState<ScheduleModel[]>([])
  const schoolYearList = useMemo<number[]>(() => {
    let sylist: number[] = []
    if (syData.length > 0) {
      sylist = syData.map((item: ScheduleModel) => item.academicYear);
    }
    const thisYear: number = (new Date()).getFullYear();
    if (!sylist.includes(thisYear)) {
      sylist.unshift(thisYear);
    }
    sylist = sylist.sort((a: number, b: number) => b - a > 0 ? 1 : b - a < 0 ? -1 : 0);
    return sylist
  }, [syData])
  const [schoolYear, setSchoolYear] = useState<number|string>((new Date()).getFullYear())
  const scheduleId = useMemo<string>(() => syData.find((item: ScheduleModel) => item.academicYear.toString() === schoolYear.toString())?._id || '', [syData, schoolYear])

  const getSYData = async () => {
    setLoading(true)
    const url = new URL('/api/schedule/data', window.location.origin)
    const response = await fetch(url)
    if (response.ok) {
      const { data } = await response.json()
      setSYData(data)
    }
    setLoading(false)
  }
  useEffect(() => {
    getSYData()
  }, [])

  const [filledSlots, setFilledSlots] = useState<number>(0)
  const [totalSlots, setTotalSlots] = useState<number>(0)
  const [isOpenSlots, setIsOpenSlots] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])
  const [showGranteesOnly, setShowGranteesOnly] = useState<boolean>(false)
  const [showNonGranteesOnly, setShowNonGranteesOnly] = useState<boolean>(false)
  const filteredData = useMemo(() => showGranteesOnly !== showNonGranteesOnly ? data.filter((item) => showGranteesOnly ? item.grantee : showNonGranteesOnly ? !item.grantee : true) : data, [data, showGranteesOnly, showNonGranteesOnly])

  const fetchResultData = useCallback(async () => {
    if (!!scheduleId) {
      setLoading(true)
      const url = new URL('/api/scholarship/results', window.location.origin)
      url.searchParams.append('id', scheduleId)
      const response = await fetch(url)
      if (response.ok) {
        const { data, filledSlots: f, totalSlots: t, isOpenSlots: o } = await response.json()
        setFilledSlots(f)
        setTotalSlots(t)
        setIsOpenSlots(o)
        setData(data)
      }
      setLoading(false)
    }
  }, [scheduleId])

  useEffect(() => {
    fetchResultData()
  }, [fetchResultData])

  return (
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        Scholarship Results (A.Y. {schoolYear} - {parseInt(schoolYear as string) + 1})
      </div>
      <div className="mb-2">
        <label htmlFor="schoolYear" className="font-[500] text-[15px] mb-2 mr-2">Select Academic Year:</label>
        <select id="schoolYear" title="Academic Year" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} className="py-1 px-2 bg-white rounded text-center border border-black">
          {schoolYearList.map((sy: number) => (
            <option key={sy} value={sy}>A.Y. {sy} - {sy + 1}</option>
          ))}
        </select>
      </div>
      { loading && <LoadingSpinnerFull />}
      { !loading && (
        <h2 className="font-[500] my-4 text-lg">Available Slots: {filledSlots} / {totalSlots} <span className={clsx(
          "ml-4 px-2 py-1 rounded border",
          isOpenSlots ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
        )}>{isOpenSlots ? 'Open Slots' : 'Closed'}</span></h2>
      )}
      <Table
        columns={columns()}
        data={filteredData}
        loading={loading}
        searchable
        toolbars={[
          <div key="filter-grantees" className="text-black flex justify-around items-center bg-white/50 px-2 rounded">
            <input type="checkbox" checked={showGranteesOnly} onChange={(e) => setShowGranteesOnly(e.target.checked)} id="filter-grantees" title="Filter Grantees" className="cursor-pointer" />
            <label htmlFor="filter-grantees" className="font-[500] text-[15px] ml-2 cursor-pointer">Show grantees only</label>
          </div>,
          <div key="filter-non-grantees" className="text-black flex justify-around items-center bg-white/50 px-2 rounded">
            <input type="checkbox" checked={showNonGranteesOnly} onChange={(e) => setShowNonGranteesOnly(e.target.checked)} id="filter-non-grantees" title="Filter Grantees" className="cursor-pointer" />
            <label htmlFor="filter-non-grantees" className="font-[500] text-[15px] ml-2 cursor-pointer">Show non-grantees only</label>
          </div>,
          <div key="dsd" className="flex-grow"></div>
        ]}
      />
    </div>
  )
}