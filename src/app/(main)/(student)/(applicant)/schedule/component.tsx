'use client'
import { LoadingSpinner } from '@app/components/loadings';
import { useSession } from '@app/lib/useSession';
import { ScheduleModel } from '@app/types/index';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

export default function ScheduleAndResultPage() {
  const { data: sessionData } = useSession({ redirect: false })

  const [syData, setSyData] = useState<ScheduleModel>()
  const [loading, setLoading] = useState(false)
  const [examScore, setExamScore] = useState<number|undefined>()
  const isOpen = useMemo(() => {
    const startDate = !!syData?.range?.startDate ? new Date(syData?.range?.startDate) : undefined
    if (!startDate) return false
    const now = new Date()
    return startDate.getTime() <= now.getTime()
  }, [syData])
  const orientationDate = useMemo(() => !!syData?.orientationDate ? (new Date(syData?.orientationDate)).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined, [syData])
  const examDate = useMemo(() => !!syData?.examDate ? (new Date(syData?.examDate)).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined, [syData])
  const endDate = useMemo(() => !!syData?.range?.endDate ? (new Date(syData?.range?.endDate)).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined, [syData])

  const getSYData = async () => {
    setLoading(true)
    const url = new URL('/api/schedule/now', window.location.origin)
    url.searchParams.append('action', 'scheduleandresult')
    const response = await fetch(url)
    if (response.ok) {
      const { data: d } = await response.json()
      setSyData(d)
    }
    setLoading(false)
  }

  useEffect(() => {
    getSYData()
  }, [])

  useEffect(() => {
    if (!!sessionData?.user?._id && !!syData && isOpen) {
      const exam = syData.examScores.find((exam) => exam.studentId === sessionData.user._id)
      if (!!exam) {
        setExamScore(exam.percentageScore)
      }
    }
  }, [isOpen, syData, sessionData])

  return (<>
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        SCHEDULE AND RESULT
      </div>
      {loading && <div className="text-center"><LoadingSpinner /></div>  }
      {!loading && isOpen && (<>
        <div className="my-8 border bg-white rounded-lg max-w-[700px]">
          <h1 className="px-4 py-3 pb-2 border-b text-xl font-bold bg-yellow-300">Schedule</h1>
          <div className="p-4 grid grid-cols-2">
            <div>Orientation Date:</div>
            <div>{orientationDate}</div>
            <div>Exam Date:</div>
            <div>{examDate}</div>
            <div>Submission of Documents Deadline:</div>
            <div>{endDate}</div>
          </div>
        </div>
        <div className="mb-4 border bg-white rounded-lg max-w-[700px]">
          <h1 className="px-4 py-3 pb-2 border-b text-xl font-bold bg-yellow-300">Result</h1>
          <div className="p-4 grid grid-cols-2">
            <div>Exam Result:</div>
            <div className={clsx('font-bold', !examScore ? 'text-gray-500' : examScore < 75 ? 'text-red-600' : 'text-green-700')}>{examScore || 'N/A'}</div>
            <div>Overall Assessment:</div>
            <div>{}</div>
          </div>
        </div>
      </>)}
    </div>
  </>)
}