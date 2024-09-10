'use client';;
import { LoadingSpinner } from "@app/components/loadings";
import { useSession } from "@app/lib/useSession";
import { RequirementModel, RequirementSubmissionModel, ScheduleModel, StudentModel, SubmissionStatus, YearLevel } from "@app/types";
import { CheckBadgeIcon, ClockIcon, ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function DocumentRequirementsPage() {
  const { data: sessionData, status } = useSession({ redirect: false })
  const [loading, setLoading] = useState<boolean>(false)
  const [studentData, setStudentData] = useState<StudentModel>();
  const [data, setData] = useState<StudentModel>();

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
  const [requirements, setRequirements] = useState<RequirementModel[]>([]);
  const scheduleId = useMemo<string>(() => syData.find((item: ScheduleModel) => item.academicYear === parseInt(schoolYear as string))?._id || '', [syData, schoolYear])

  const getSYData = async () => {
    setLoading(true)
    const url = new URL('/api/schedule/data', window.location.origin)
    const response = await fetch(url)
    if (response.ok) {
      const { data: d } = await response.json()
      setSYData(d)
    }
    setLoading(false)
  }

  const fetchStudentData = useCallback(async () => {
    setLoading(true)
    if (status === 'authenticated') {
      const url = new URL('/api/scholarship/applications', window.location.origin)
      url.searchParams.append('studentId', sessionData.studentId)
      url.searchParams.append('academicYear', schoolYear.toString())
      const response = await fetch(url)
      if (response.ok) {
        const { data: d } = await response.json()
        setStudentData(d)
      }
    }
  }, [status, sessionData.studentId, schoolYear])

  const fetchRequirements = useCallback(async () => {
    try {
      const url = new URL('/api/scholarship/requirements', window.location.origin)
      url.searchParams.append('academicYear', schoolYear.toString())
      url.searchParams.append('firstYearOnly', studentData?.applicationForm?.yearLevel === YearLevel.FirstYear ? "true" : "false")
      const response = await fetch(url)
      if (response.ok) {
        const { data: d } = await response.json()
        setRequirements(d)
      }
    } catch (e) {}
  }, [schoolYear, studentData])

  const fetchData = useCallback(async () => {
    try {
      const url = new URL('/api/scholarship/grantees', window.location.origin)
      url.searchParams.append('academicYear', schoolYear.toString())
      url.searchParams.append('type', studentData?.applicationForm?.yearLevel === YearLevel.FirstYear ? "new_firstYear" : "new")
      const response = await fetch(url)
      if (response.ok) {
        const { data: d } = await response.json()
        setData(d);
      }
    } catch (e) {}
    setLoading(false)
  }, [schoolYear, studentData?.applicationForm?.yearLevel])

  useEffect(() => {
    getSYData()
      .then(fetchStudentData)
      .then(fetchRequirements)
      .then(fetchData)
      .catch((e) => { setLoading(false); console.log(e) })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolYear, status])

  const getRequirementSubmissionFromId = useCallback((reqId?: string): RequirementSubmissionModel|undefined => !reqId ? undefined : (data?.applicationSubmission as RequirementSubmissionModel[])?.find((rs: RequirementSubmissionModel) => rs.requirementId.toString() === reqId), [data])

  return (
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        DOCUMENTS REQUIREMENTS
      </div>
      <div className="flex flex-wrap justify-start items-start gap-4 p-4">
        { loading && <LoadingSpinner /> }
        {/* Document cards */}
        { !loading && requirements.map((req: RequirementModel) => (
          <button key={req._id} type="button" className="relative w-[200px] bg-[#F9F9F9] border rounded-lg shadow-md p-6" title={!getRequirementSubmissionFromId(req._id) ? 'Submission needed' : getRequirementSubmissionFromId(req._id)!.status}>
            <ExclamationCircleIcon className={clsx("absolute top-2 right-2 w-10 h-10 text-yellow-500", !getRequirementSubmissionFromId(req._id) ? '' : 'hidden')} />
            <ClockIcon className={clsx("absolute top-2 right-2 w-10 h-10 text-gray-500", getRequirementSubmissionFromId(req._id)?.status === SubmissionStatus.Pending ? '' : 'hidden')} />
            <CheckBadgeIcon className={clsx("absolute top-2 right-2 w-10 h-10 text-green-500", getRequirementSubmissionFromId(req._id)?.status === SubmissionStatus.Approved ? '' : 'hidden')} />
            <XCircleIcon className={clsx("absolute top-2 right-2 w-10 h-10 text-red-500", getRequirementSubmissionFromId(req._id)?.status === SubmissionStatus.Disapproved ? '' : 'hidden')} />
            <div className="w-fit mx-auto">
              <Image src="/doc-icon.svg" alt="Document Icon" width={150} height={150} />
            </div>
            <div className="text-lg font-bold w-full text-center pt-3 border-b">{req.name}</div>
            <p className="text-xs w-full text-start pt-1">{req.description}</p>
          </button>
        ))}
        { !loading && requirements.length === 0 && <div className="text-center text-gray-500">Nothing to submit here.</div> }
      </div>
    </div>
  )
}