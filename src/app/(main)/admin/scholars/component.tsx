'use client'

import { LoadingSpinnerFull } from "@app/components/loadings"
import Table, { TableColumnProps } from "@app/components/tables"
import Tabs from "@app/components/tabs"
import { ApplicationFormProps, GranteeModel, RequirementModel, RequirementSubmissionModel, Semester, StudentModel, SubmissionStatus } from "@app/types"
import { useCallback, useEffect, useState } from "react"

const getApplicantRequirements = async (academicYear: number, firstYearOnly: boolean): Promise<TableColumnProps[]> => {
  const url = new URL('/api/scholarship/requirements', window.location.origin)
  url.searchParams.append('academicYear', academicYear.toString())
  url.searchParams.append('firstYearOnly', firstYearOnly? 'true' : 'false')
  const response = await fetch(url)
  if (response.ok) {
    const { data } = await response.json()
    return data.map((r: RequirementModel) => ({
      label: r.name,
      field: r.description,
      align: 'center',
      sortable: true,
      render: (rowData: StudentModel) => (rowData.applicationSubmission as RequirementSubmissionModel[]).find(subm => subm.requirementId === r._id)?.status === SubmissionStatus.Approved ? <span className="text-green-800 font-bold">Yes</span> : <span className="text-red-500 font-bold capitalize">{(rowData.applicationSubmission as RequirementSubmissionModel[]).find(subm => subm.requirementId === r._id)?.status}</span>,
    }))
  }
  return []
}

const columns = async (type: 'applicant'|'applicant_firstYear'|'grantee', academicYear: number): Promise<TableColumnProps[]> => ([
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
  ? (await getApplicantRequirements(academicYear, false))
  : type === 'applicant_firstYear'
  ? (await getApplicantRequirements(academicYear, true))
  : [
    {
      label: 'COG',
      field: 'COG',
      sortable: true,
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) => rowData.granteeSubmissions?.COG.status === SubmissionStatus.Approved ? <span className="text-green-800 font-bold">Yes</span> : <span className="text-red-500 font-bold capitalize">{rowData.granteeSubmissions?.COG.status}</span>,
    },
    {
      label: 'StudyLoad',
      field: 'studyLoad',
      sortable: true,
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) => rowData.granteeSubmissions?.studyLoad.status === SubmissionStatus.Approved ? <span className="text-green-800 font-bold">Yes</span> : <span className="text-red-500 font-bold capitalize">{rowData.granteeSubmissions?.COG.status}</span>,
    },
    {
      label: 'Statement of Account',
      field: 'statementOfAccount',
      sortable: true,
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) => rowData.granteeSubmissions?.statementOfAccount.status === SubmissionStatus.Approved ? <span className="text-green-800 font-bold">Yes</span> : <span className="text-red-500 font-bold capitalize">{rowData.granteeSubmissions?.COG.status}</span>,
    },
    {
      label: 'CONS',
      field: 'CONS',
      sortable: true,
      render: (rowData: StudentModel & { granteeSubmissions: GranteeModel }) => rowData.granteeSubmissions?.CONS.status === SubmissionStatus.Approved ? <span className="text-green-800 font-bold">Yes</span> : <span className="text-red-500 font-bold capitalize">{rowData.granteeSubmissions?.COG.status}</span>,
    },
  ])

export default function ScholarListPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [schoolYear, setSchoolYear] = useState<number>((new Date()).getFullYear())
  const [semester, setSemester] = useState<Semester>(Semester.FirstSemester)
  const [applicantColumns, setApplicant] = useState<TableColumnProps[]>([])
  const [applicant1stYearColumns, setApplicant1stYear] = useState<TableColumnProps[]>([])
  const [granteeColumns, setGrantee] = useState<TableColumnProps[]>([])

  const [dataApplicant, setDataApplicant] = useState<StudentModel[]>([])
  const [dataApplicant1stYear, setDataApplicant1stYear] = useState<StudentModel[]>([])
  const [dataGrantee, setDataGrantee] = useState<StudentModel[]>([])

  useEffect(() => {
    columns('applicant', schoolYear).then(setApplicant)
    columns('applicant_firstYear', schoolYear).then(setApplicant1stYear)
    columns('grantee', schoolYear).then(setGrantee)
  }, [schoolYear])

  const fetchAcademicYear = async () => {
    const url = new URL('/api/schedule/now', window.location.origin)
    const response = await fetch(url)
    let sy = (new Date()).getFullYear()
    if (response.ok) {
      const { data } = await response.json()
      if (!!data) {
        setSchoolYear(data.academicYear)
      }
    }
    return sy
  }
  const fetchData = useCallback(async (sy: number) => {
    setLoading(true)
    const url1 = new URL('/api/scholarship/grantees', window.location.origin)
    url1.searchParams.append('academicYear', sy.toString())
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
    url2.searchParams.append('academicYear', sy.toString())
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
    url3.searchParams.append('academicYear', sy.toString())
    url2.searchParams.append('semester', semester.toString())
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
  }, [semester, applicantColumns])

  useEffect(() => {
    fetchAcademicYear()
      .then((sy) => fetchData(sy))
  }, [fetchData])

  const onView = useCallback((rowData: ApplicationFormProps) => {
    console.log('Viewing application form for:', rowData)
  }, [])

  return (
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-3 border-black text-black font-[700]">
        SCHOLARSHIP STATUS A.Y. {schoolYear} - {schoolYear + 1}
      </div>
      <div className="py-2 font-[500] text-[15px] leading-[19px]">
        You can view and update the status.
      </div>
      <div className="py-2 font-[500] text-[15px] leading-[19px]">
        <label htmlFor="semester" className="mr-2 font-bold text-lg">Semester:</label>
        <select name="semester" id="semester" title="Semester" className="px-2 py-1 rounded bg-white border border-gray-400 cursor-pointer">
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
  )
}