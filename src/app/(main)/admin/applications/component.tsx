'use client'

import { LoadingSpinnerFull } from "@app/components/loadings";
import Table, { TableColumnProps } from "@app/components/tables";
import { StudentModel, YearLevel } from "@app/types";
import { EyeIcon } from "@heroicons/react/16/solid";
import { useCallback, useEffect, useState } from "react";
import { ApplicationFormProps } from '../../../../types/index';

const columns = (onView: (rowData: ApplicationFormProps) => void): TableColumnProps[] => [
  {
    label: 'Email',
    field: 'email',
    sortable: true,
    searchable: true
  },
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
    label: 'Date of Birth',
    field: 'dateOfBirth',
    sortable: true,
    searchable: true,
    render(rowData: ApplicationFormProps) {
      return new Date(rowData.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  },
  {
    label: 'Age',
    field: 'age',
    sortable: true,
    searchable: true,
  },
  {
    label: 'Sex',
    field: 'sex',
    sortable: true,
    searchable: true,
  },
  {
    label: 'Civil Status',
    field: 'civilStatus',
    sortable: true,
    searchable: true,
  },
  {
    label: 'Mobile No.',
    field: 'mobileNo',
    sortable: true,
    searchable: true,
  },
  {
    label: 'School Attended',
    field: 'nameOfSchoolAttended',
    sortable: true,
    searchable: true,
  },
  {
    label: 'School Sector',
    field: 'schoolSector',
    sortable: true,
    searchable: true,
  },
  {
    label: 'Year Level',
    field: 'yearLevel',
    sortable: true,
    searchable: true,
    render(rowData: ApplicationFormProps) {
      return rowData.yearLevel === YearLevel.FirstYear
        ? '1st Year'
        : rowData.yearLevel === YearLevel.SecondYear
        ? '2nd Year'
        : rowData.yearLevel === YearLevel.ThirdYear
        ? '3rd Year'
        : rowData.yearLevel === YearLevel.FourthYear
        ? '4th Year'
        : 'Invalid Year Level'
    }
  },
  {
    label: 'Course',
    field: 'course',
    sortable: true,
    searchable: true,
  },
  {
    label: 'Action',
    field: 'action',
    render(rowData: ApplicationFormProps) {
      return (
        <button type="button" onClick={() => onView(rowData)} title="View and Print Application Form"><EyeIcon className="w-4 h-4" /></button>
      )
    }
  }
]
export default function ApplicationListPage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [schoolYear, setSchoolYear] = useState<number>((new Date()).getFullYear())
  const [data, setData] = useState<StudentModel[]>([])
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
  const fetchData = async (sy: number) => {
    setLoading(true)
    const url = new URL('/api/scholarship/applications', window.location.origin)
    url.searchParams.append('academicYear', sy.toString())
    url.searchParams.append('application', 'applicant')
    const response = await fetch(url)
    if (response.ok) {
      const { data } = await response.json()
      const d = data.filter((item: StudentModel) => !!item.applicationForm).reduce((init: (ApplicationFormProps & { email: string })[] | [], item: StudentModel) => [...init, {...item.applicationForm, email: item.email, age: Math.floor(((new Date()).getTime() - (new Date(item.applicationForm!.dateOfBirth)).getTime()) / (1000 * 60 * 60 * 24 * 365)) }], [])
      setData(d);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAcademicYear()
      .then((sy) => fetchData(sy))
  }, [])

  const onView = useCallback((rowData: ApplicationFormProps) => {
    console.log('Viewing application form for:', rowData)
  }, [])

  return (<>
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        SCHOLARSHIP APPLICATIONS (A.Y. {schoolYear} - {schoolYear + 1})
      </div>
      { loading && <LoadingSpinnerFull />}
      <Table columns={columns(onView)} data={data} />
    </div>
  </>)
}