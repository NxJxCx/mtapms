'use client'
/* eslint-disable @next/next/no-img-element */
import { displayFullName } from '@app/components/display'
import { LoadingSpinnerFull } from "@app/components/loadings"
import { Modal } from "@app/components/modals"
import { useSidebar } from "@app/components/sidebar"
import Table, { TableColumnProps } from "@app/components/tables"
import Tabs from "@app/components/tabs"
import {
  GranteeModel,
  RequirementModel,
  RequirementSubmissionModel,
  Roles,
  ScheduleModel,
  Semester,
  StudentModel,
  SubmissionProps,
  SubmissionStatus,
} from "@app/types"
import { CheckBadgeIcon, CheckIcon, XMarkIcon } from "@heroicons/react/16/solid"
import clsx from "clsx"
import { useCallback, useEffect, useMemo, useState } from "react"

const getApplicantRequirements = async (academicYear: number, firstYearOnly: boolean, onViewSubmission?: (req: RequirementModel, student: StudentModel, data?: RequirementSubmissionModel) => void): Promise<TableColumnProps[]> => {
  const url = new URL('/api/scholarship/requirements', window.location.origin)
  url.searchParams.append('academicYear', academicYear.toString())
  url.searchParams.append('firstYearOnly', firstYearOnly? 'true' : 'false')
  const response = await fetch(url)
  if (response.ok) {
    const { data } = await response.json()
    return data.map((r: RequirementModel) => ({
      label: r.name,
      field: r.name,
      align: 'center',
      sortable: true,
      render: (rowData: StudentModel) => (rowData.applicationSubmission as RequirementSubmissionModel[]).find(subm => subm.requirementId === r._id)?.status === SubmissionStatus.Approved
      ? <span className="text-green-800 font-bold">Yes</span>
      : (
        <button type="button" onClick={() => onViewSubmission && onViewSubmission(r, rowData, (rowData.applicationSubmission as RequirementSubmissionModel[]).find(subm => subm.requirementId === r._id))} title="View Study Load">
          <span className={clsx("font-bold capitalize", (rowData.applicationSubmission as RequirementSubmissionModel[]).find(subm => subm.requirementId === r._id)?.status === SubmissionStatus.Pending ? 'text-gray-500 bg-gray-100 px-2 py-1 hover:bg-gray-200' : 'text-red-500')}>{(rowData.applicationSubmission as RequirementSubmissionModel[]).find(subm => subm.requirementId === r._id)?.status || 'N/A'}</span>
        </button>
      ),
    }))
  }
  return []
}

const columns = async (type: 'applicant'|'applicant_firstYear'|'grantee', academicYear: number, onViewSubmission?: (req: RequirementModel, student: StudentModel, data?: RequirementSubmissionModel) => void, onViewGranteeSubmission?: (key: 'COG'|'studyLoad'|'statementOfAccount'|'CONS', data: GranteeModel, student: StudentModel) => void): Promise<TableColumnProps[]> => ([
  {
    label: 'Last Name',
    field: 'lastName',
    sortable: true,
    searchable: true
  },
  {
    label: 'First Name',
    field: 'firstName',
    sortable: true,
    searchable: true
  },
  {
    label: 'Middle Name',
    field: 'middleName',
    sortable: true,
    searchable: true
  },
  {
    label: 'Sex',
    field: 'sex',
    sortable: true,
    searchable: true
  },
  {
    label: 'Civil Status',
    field: 'civilStatus',
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
    label: 'Contact #',
    field: 'mobileNo',
    sortable: true,
    searchable: true
  },
  {
    label: 'Email',
    field: 'email',
    sortable: true,
    searchable: true
  },
] as TableColumnProps[])
.concat(
  type === 'applicant'
  ? (await getApplicantRequirements(academicYear, false, onViewSubmission))
  : type === 'applicant_firstYear'
  ? (await getApplicantRequirements(academicYear, true, onViewSubmission))
  : [
    {
      label: 'COG',
      field: 'COG',
      sortable: true,
      align: 'center',
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) =>
        rowData.granteeSubmissions?.COG?.status === SubmissionStatus.Approved
        ? <span className="text-green-800 font-bold">Yes</span>
        : (
          <button type="button" onClick={() => onViewGranteeSubmission && onViewGranteeSubmission('COG', rowData.granteeSubmissions, rowData as StudentModel)} title="View COG">
            <span className={clsx("font-bold capitalize", rowData.granteeSubmissions?.COG?.status === SubmissionStatus.Pending ? 'text-gray-500 bg-gray-100 px-2 py-1 hover:bg-gray-200' : 'text-red-500')}>{rowData.granteeSubmissions?.COG?.status || 'N/A'}</span>
          </button>
        ),
    },
    {
      label: 'StudyLoad',
      field: 'studyLoad',
      sortable: true,
      align: 'center',
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) =>
        rowData.granteeSubmissions?.studyLoad?.status === SubmissionStatus.Approved
        ? <span className="text-green-800 font-bold">Yes</span>
        : (
          <button type="button" onClick={() => onViewGranteeSubmission && onViewGranteeSubmission('studyLoad', rowData.granteeSubmissions, rowData as StudentModel)} title="View Study Load">
            <span className={clsx("font-bold capitalize", rowData.granteeSubmissions?.studyLoad?.status === SubmissionStatus.Pending ? 'text-gray-500 bg-gray-100 px-2 py-1 hover:bg-gray-200' : 'text-red-500')}>{rowData.granteeSubmissions?.studyLoad?.status || 'N/A'}</span>
          </button>
        ),
    },
    {
      label: 'Statement of Account',
      field: 'statementOfAccount',
      sortable: true,
      align: 'center',
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) =>
        rowData.granteeSubmissions?.statementOfAccount?.status === SubmissionStatus.Approved
        ? <span className="text-green-800 font-bold">Yes</span>
        : (
          <button type="button" onClick={() => onViewGranteeSubmission && onViewGranteeSubmission('statementOfAccount', rowData.granteeSubmissions, rowData as StudentModel)} title="View Statement of Account">
            <span className={clsx("font-bold capitalize", rowData.granteeSubmissions?.statementOfAccount?.status === SubmissionStatus.Pending ? 'text-gray-500 bg-gray-100 px-2 py-1 hover:bg-gray-200' : 'text-red-500')}>{rowData.granteeSubmissions?.statementOfAccount?.status || 'N/A'}</span>
          </button>
        ),
    },
    {
      label: 'CONS',
      field: 'CONS',
      sortable: true,
      align: 'center',
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) =>
        rowData.granteeSubmissions?.CONS?.status === SubmissionStatus.Approved
        ? <span className="text-green-800 font-bold">Yes</span>
        : (
          <button type="button" onClick={() => onViewGranteeSubmission && onViewGranteeSubmission('CONS', rowData.granteeSubmissions, rowData as StudentModel)} title="View CONS">
            <span className={clsx("font-bold capitalize", rowData.granteeSubmissions?.CONS?.status === SubmissionStatus.Pending ? 'text-gray-500 bg-gray-100 px-2 py-1 hover:bg-gray-200' : 'text-red-500')}>{rowData.granteeSubmissions?.CONS?.status || 'N/A'}</span>
          </button>
        ),
    },
  ])

export default function ScholarListPage() {
  const { toggleDrawer, openDrawer } = useSidebar({ role: Roles.Admin })
  const [loading, setLoading] = useState<boolean>(true)
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
  const [semester, setSemester] = useState<Semester|string>(Semester.FirstSemester)

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

  const [applicantColumns, setApplicant] = useState<TableColumnProps[]>([])
  const [applicant1stYearColumns, setApplicant1stYear] = useState<TableColumnProps[]>([])
  const [granteeColumns, setGrantee] = useState<TableColumnProps[]>([])

  const [dataApplicant, setDataApplicant] = useState<StudentModel[]>([])
  const [dataApplicant1stYear, setDataApplicant1stYear] = useState<StudentModel[]>([])
  const [dataGrantee, setDataGrantee] = useState<StudentModel[]>([])
  const [selected, setSelected] = useState<{
    student: StudentModel;
    id: string;
    type: 'new'|'new_firstYear'|'grantee';
    key: string;
    data: RequirementSubmissionModel|SubmissionProps
  }|undefined>()

  const onModalClose = useCallback(() => {
    setSelected(undefined)
  }, [])

  const onViewGranteeSubmission = useCallback((key: 'COG'|'studyLoad'|'statementOfAccount'|'CONS', data: GranteeModel, student: StudentModel) => {
    if (!data?.[key]) return;
    if (openDrawer) toggleDrawer();
    setSelected({
      student,
      id: data._id!,
      type: 'grantee',
      key,
      data: data[key],
    })
  }, [openDrawer, toggleDrawer])

  const onViewSubmission = useCallback((key: string, data: RequirementSubmissionModel, student: StudentModel) => {
    if (!data) return;
    if (openDrawer) toggleDrawer();
  }, [openDrawer, toggleDrawer])

  useEffect(() => {
    if (onViewGranteeSubmission && schoolYear) {
      columns('applicant', schoolYear as number).then(setApplicant)
      columns('applicant_firstYear', schoolYear as number).then(setApplicant1stYear)
      columns('grantee', schoolYear as number, undefined, onViewGranteeSubmission).then(setGrantee)
    }
  }, [schoolYear, onViewGranteeSubmission])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const url1 = new URL('/api/scholarship/grantees', window.location.origin)
    url1.searchParams.append('academicYear', schoolYear.toString())
    url1.searchParams.append('semester', semester.toString())
    url1.searchParams.append('type', 'new')
    const response1 = await fetch(url1)
    if (response1.ok) {
      const { data } = await response1.json()
      const d = data.reduce((init: any[], item: StudentModel) => [...init, ({
        ...item, lastName: item.applicationForm!.lastName, firstName: item.applicationForm!.firstName, middleName: item.applicationForm!.middleName,
        sex: item.applicationForm!.sex, civilStatus: item.applicationForm!.civilStatus,
        nameOfSchoolAttended: item.applicationForm!.nameOfSchoolAttended, mobileNo: item.applicationForm!.mobileNo,
        ...(Object.keys(applicantColumns).filter(key => !['lastName', 'firstName','middleName','sex', 'civilStatus', 'nameOfSchoolAttended','mobileNo', 'email'].includes(key))
          .reduce((acc: any, key: string) => ({...acc, [key]: true }), ({})))
      })], [])
      setDataApplicant(d);
    }
    const url2 = new URL('/api/scholarship/grantees', window.location.origin)
    url2.searchParams.append('academicYear', schoolYear.toString())
    url2.searchParams.append('semester', semester.toString())
    url2.searchParams.append('type', 'new_firstYear')
    const response2 = await fetch(url2)
    if (response2.ok) {
      const { data } = await response2.json()
      const d = data.reduce((init: any[], item: StudentModel) => [...init, ({
        ...item, lastName: item.applicationForm!.lastName, firstName: item.applicationForm!.firstName, middleName: item.applicationForm!.middleName,
        sex: item.applicationForm!.sex, civilStatus: item.applicationForm!.civilStatus,
        nameOfSchoolAttended: item.applicationForm!.nameOfSchoolAttended, mobileNo: item.applicationForm!.mobileNo,
        ...(Object.keys(applicantColumns).filter(key => !['lastName', 'firstName','middleName','sex', 'civilStatus', 'nameOfSchoolAttended','mobileNo', 'email'].includes(key))
          .reduce((acc: any, key: string) => ({...acc, [key]: true }), ({})))
      })], [])
      setDataApplicant1stYear(d);
    }
    const url3 = new URL('/api/scholarship/grantees', window.location.origin)
    url3.searchParams.append('academicYear', schoolYear.toString())
    url3.searchParams.append('semester', semester.toString())
    url3.searchParams.append('type', 'grantee')
    const response3 = await fetch(url3)
    if (response3.ok) {
      const { data } = await response3.json()
      const d = data.reduce((init: any[], item: StudentModel) => [...init, ({
        ...item, lastName: item.applicationForm!.lastName, firstName: item.applicationForm!.firstName, middleName: item.applicationForm!.middleName,
        sex: item.applicationForm!.sex, civilStatus: item.applicationForm!.civilStatus,
        nameOfSchoolAttended: item.applicationForm!.nameOfSchoolAttended, mobileNo: item.applicationForm!.mobileNo,
        COG: true, studyLoad: true, statementOfAccount: true, CONS: true,
      })], [])
      setDataGrantee(d);
    }
    setLoading(false);
  }, [semester, schoolYear, applicantColumns])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getURLFromSubmission = useCallback((photoId?: string) => (new URL("/api/user/photo/" + photoId, window.location.origin)).toString(), [])

  return (<>
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-3 border-black text-black font-[700]">
        SCHOLARSHIP STATUS A.Y. {schoolYear} - {parseInt(schoolYear.toString()) + 1}
      </div>
      <div className="mb-2">
        <label htmlFor="schoolYear" className="text-[15px] mb-2 mr-2 font-bold text-lg">Academic Year:</label>
        <select id="schoolYear" title="Academic Year" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} className="py-1 px-2 bg-white rounded text-center border border-black">
          {schoolYearList.map((sy: number) => (
            <option key={sy} value={sy}>A.Y. {sy} - {sy + 1}</option>
          ))}
        </select>
      </div>
      <div className="py-2 font-[500] text-[15px] leading-[19px]">
        <label htmlFor="semester" className="mr-2 font-bold text-lg">Semester:</label>
        <select name="semester" id="semester" title="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} className="px-2 py-1 rounded bg-white border border-gray-400 cursor-pointer">
          <option value={Semester.FirstSemester}>First Semester</option>
          <option value={Semester.SecondSemester}>Second Semester</option>
        </select>
      </div>
      <Tabs.TabNav tabs={[{ label: '1st Year New Grantees', key: 'new_firstYear'}, { label: 'New Grantees', key: 'new' }, { label: 'Old Grantees', key:'grantee' }]}>
        <Tabs.TabContent name="new">
          <div className="w-full font-[500] text-[15px] min-w-[500px] text-black p-4">
            {applicantColumns.length === 0 && (
              <LoadingSpinnerFull/>
            )}
            {applicantColumns.length > 0 && (
              <Table columns={applicantColumns} loading={loading} data={dataApplicant} searchable />
            )}
          </div>
        </Tabs.TabContent>
        <Tabs.TabContent name="new_firstYear">
          <div className="w-full font-[500] text-[15px] min-w-[500px] text-black p-4">
            {applicant1stYearColumns.length === 0 && (
              <LoadingSpinnerFull/>
            )}
            {applicant1stYearColumns.length > 0 && (
              <Table columns={applicant1stYearColumns} loading={loading} data={dataApplicant1stYear} searchable />
            )}
          </div>
        </Tabs.TabContent>
        <Tabs.TabContent name="grantee">
          <div className="w-full font-[500] text-[15px] min-w-[500px] text-black p-4">
            {granteeColumns.length === 0 && (
              <LoadingSpinnerFull/>
            )}
            {granteeColumns.length > 0 && (
              <Table columns={granteeColumns} loading={loading} data={dataGrantee} searchable />
            )}
          </div>
        </Tabs.TabContent>
      </Tabs.TabNav>
    </div>
    <Modal title={selected?.key} open={!!selected} onClose={onModalClose}>
      <div className="flex flex-col">
      {(selected?.data?.status === SubmissionStatus.Pending || selected?.data?.status === SubmissionStatus.Approved) && (
          <div className="font-[500] p-4">
            <div className="text-gray-500">
              Submission status: <span className="font-bold">{SubmissionStatus[selected?.data?.status]}</span>
            </div>
            <div className="text-gray-500">
              Submitted by: <span className="font-bold">{displayFullName(selected?.student as any)}</span>
            </div>
            <div className=" text-gray-500">
              Last update: {(new Date(selected?.data?.updatedAt!)).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, })}
            </div>
            {selected?.data?.status === SubmissionStatus.Pending && (
              <div className="mt-4 flex justify-evenly">
                <button type="button" className="px-2 py-1 bg-green-50 rounded border border-green-500"><CheckIcon className='w-4 h-4 inline text-green-700 mr-1' />Approve</button>
                <button type="button" className="px-2 py-1 bg-red-50 rounded border border-red-500"><XMarkIcon className='w-4 h-4 inline text-red-500 mr-1' />Disapprove</button>
              </div>
            )}
            {selected?.data?.status === SubmissionStatus.Approved && (
              <div className="mt-4 text-center text-green-600 rounded p-1">
                <CheckBadgeIcon className="inline w-4 h-4 mr-2"/> Submission approved.
              </div>
            )}
            {selected?.data?.status === SubmissionStatus.Approved && (
              <div className="mt-4 text-center text-red-600 rounded p-1">
                <CheckBadgeIcon className="inline w-4 h-4 mr-2"/> Submission disapproved.
              </div>
            )}
            <div className="max-w-[700px] max-h-[calc(100vh-400px)] mt-4 shadow-lg border overflow-y-auto">
              <img src={!!selected?.data?.photo ? getURLFromSubmission(selected.data.photo as string) : ''} alt="Submission" width={1000} height={1000} className="w-full h-full" />
            </div>
          </div>
        )}
        <div className="p-2 flex justify-end items-center mt-2">
          <button type="button" title="Close" className="border border-gray-500 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 font-[500]" onClick={onModalClose}>Close</button>
        </div>
      </div>
    </Modal>
  </>)
}