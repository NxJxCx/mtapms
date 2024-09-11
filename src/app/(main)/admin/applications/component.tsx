'use client'

/* eslint-disable @next/next/no-img-element */
import { displayFullName, displayYearLevel } from "@app/components/display";
import { LoadingSpinnerFull } from "@app/components/loadings";
import { Modal } from "@app/components/modals";
import { useSidebar } from "@app/components/sidebar";
import Table, { TableColumnProps } from "@app/components/tables";
import { ApplicationFormProps, Roles, StudentModel, YearLevel } from '@app/types';
import { CheckIcon, EyeIcon, PrinterIcon } from "@heroicons/react/16/solid";
import clsx from 'clsx';
import { Montserrat } from 'next/font/google';
import { useCallback, useEffect, useState } from "react";

const columns = (onView: (rowData: StudentModel & ApplicationFormProps & { age: number, studId: string }) => void): TableColumnProps[] => [
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
    render(rowData: StudentModel & ApplicationFormProps & { age: number, studId: string }) {
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
    render(rowData: StudentModel & ApplicationFormProps & { age: number, studId: string }) {
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
    render(rowData: StudentModel & ApplicationFormProps & { age: number, studId: string }) {
      return (
        <button type="button" onClick={() => onView(rowData)} title="View and Print Application Form" className="text-[#00823E]"><EyeIcon className="w-5 h-5 inline" /> View</button>
      )
    }
  }
]

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'] })

export default function ApplicationListPage() {
  const { toggleDrawer, openDrawer } = useSidebar({ role: Roles.Admin })
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
      const d = data.filter((item: StudentModel) => !!item.applicationForm).reduce((init: (StudentModel & ApplicationFormProps & { age: number, studId: string })[] | [], item: StudentModel) => [...init, {...item, ...item.applicationForm, studId: item._id, email: item.email, age: Math.floor(((new Date()).getTime() - (new Date(item.applicationForm!.dateOfBirth)).getTime()) / (1000 * 60 * 60 * 24 * 365)) }], [])
      setData(d);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAcademicYear()
      .then((sy) => fetchData(sy))
  }, [])

  const [openViewModal, setOpenViewModal] = useState<(StudentModel & ApplicationFormProps & { age: number, studId: string })|undefined>()
  const onCloseViewModal = () => {
    setOpenViewModal(undefined)
  }
  const onOpenViewModal = useCallback((rowData: StudentModel & ApplicationFormProps & { age: number, studId: string }) => {
    if (openDrawer) {
      toggleDrawer()
    }
    setOpenViewModal(rowData)
  }, [openDrawer, toggleDrawer])

  const onView = useCallback((rowData: StudentModel & ApplicationFormProps & { age: number, studId: string }) => {
    onOpenViewModal(rowData)
  }, [onOpenViewModal])

  const onPrint = useCallback(() => {
    const url = new URL('/print', window.location.origin)
    url.searchParams.append('template', 'application')
    url.searchParams.append('studId', openViewModal?.studId || '')
    url.searchParams.append('academicYear', schoolYear.toString())
    // open new window no toolbars for printing only
    const win = window.open(url, '_blank', 'menubar=no,status=no,titlebar=no,scrollbars=yes,resizable=yes')
    if (win) {
      win.onafterprint = () => {
        win?.close()
      }
      win.onload = () => {
        win?.print()
      }
    }
  }, [openViewModal, schoolYear])

  return (<>
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        SCHOLARSHIP APPLICATIONS (A.Y. {schoolYear} - {schoolYear + 1})
      </div>
      { loading && <LoadingSpinnerFull />}
      <Table columns={columns(onView)} data={data} searchable />
    </div>
    <Modal title="Scholar Applicant Information" open={!!openViewModal} onClose={onCloseViewModal}>
      <div className={clsx(montserrat.className, "text-[15px] leading-[19px] w-full p-4")}>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td colSpan={3}>
                <div className="aspect-square object-contain h-[80px] w-[80px] overflow-hidden border border-black/50 rounded p-[5px]">
                  <img src={"/api/user/photo/" + openViewModal?.photo} width={70} height={70} className="aspect-square" alt="photo" />
                </div>
              </td>
              <td colSpan={4}></td>
            </tr>
            <tr>
              <td colSpan={7} className="text-center">
                <h1 className="font-[700] mx-auto py-1">Personal Information</h1>
              </td>
            </tr>
            <tr className="*:px-2 border-t border-black">
              <td className="pt-2 border-l border-black">Name:</td>
              <td>{displayFullName(openViewModal) || 'N/A'}</td>
              <td className="border-l border-black">PermanentAddress:</td>
              <td colSpan={2}>{openViewModal?.permanentAddress || 'N/A'}</td>
              <td className="border-l border-black">Zip Code:</td>
              <td className="border-r border-black">{openViewModal?.zipCode || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Date of Birth:</td>
              <td>{new Date(openViewModal?.dateOfBirth || '1990-01-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })?? 'N/A'}</td>
              <td className="border-l border-black">Present Address:</td>
              <td colSpan={2}>{openViewModal?.presentAddress || 'N/A'}</td>
              <td rowSpan={8} className="border-l border-black align-top pt-1">Province:</td>
              <td rowSpan={8} className="border-r border-black align-top pt-1">{openViewModal?.province || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Place of Birth:</td>
              <td>{openViewModal?.placeOfBirth || 'N/A'}</td>
              <td className="border-l border-black">Name of School Attended</td>
              <td colSpan={2}>{openViewModal?.nameOfSchoolAttended || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Sex:</td>
              <td>{openViewModal?.sex?? 'N/A'}</td>
              <td className="border-l border-black">School Address:</td>
              <td colSpan={2}>{openViewModal?.schoolAddress || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Civil Status:</td>
              <td>{openViewModal?.civilStatus || 'N/A'}</td>
              <td className="border-l border-black">School Sector:</td>
              <td colSpan={2}>{openViewModal?.schoolSector || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Mobile Number:</td>
              <td>{openViewModal?.mobileNo || 'N/A'}</td>
              <td className="border-l border-black">Year Level:</td>
              <td colSpan={2}>{displayYearLevel(openViewModal?.yearLevel) || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Email Address:</td>
              <td>{openViewModal?.email|| 'N/A'}</td>
              <td rowSpan={3} className="border-l border-black align-top pt-1">Course:</td>
              <td colSpan={2} rowSpan={3} className="align-top pt-1">{openViewModal?.course || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Type of Disability (if applicable):</td>
              <td>{openViewModal?.typeOfDisability || 'N/A'}</td>
            </tr>
            <tr className="*:px-2 border-b border-black">
              <td className="py-2 border-l border-black">Tribal Membership (if applicable):</td>
              <td>{openViewModal?.tribalMembership || 'N/A'}</td>
            </tr>
            <tr className="border border-black">
              <td colSpan={7} className="text-center">
                <h1 className="font-[700] mx-auto py-1">Family Background</h1>
              </td>
            </tr>
            <tr className="*:px-2 border-t border-black">
              <td className="pt-2 border-l border-black">&nbsp;</td>
              <td colSpan={3} className="border-x border-black text-center">Father: ({openViewModal?.fatherLiving ? <CheckIcon className="w-4 h-4 text-green-700 inline" /> : ' '}) Living ({!openViewModal?.fatherLiving ? <CheckIcon className="w-4 h-4 text-green-700 inline" /> : ' '}) Deceased</td>
              <td colSpan={3} className="border-r border-black text-center">Mother: ({openViewModal?.motherLiving ? <CheckIcon className="w-4 h-4 text-green-700 inline" /> : ' '}) Living ({!openViewModal?.motherLiving ? <CheckIcon className="w-4 h-4 text-green-700 inline" /> : ' '}) Deceased</td>
            </tr>
            <tr className="*:px-2 border-t border-black">
              <td className="pt-2 border-l border-black">Name:</td>
              <td colSpan={3} className="border-x border-black">{openViewModal?.fatherName || 'N/A'}</td>
              <td colSpan={3} className="border-r border-black">{openViewModal?.motherName || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Address:</td>
              <td colSpan={3} className="border-x border-black">{openViewModal?.fatherAddress || 'N/A'}</td>
              <td colSpan={3} className="border-r border-black">{openViewModal?.motherAddress || 'N/A'}</td>
            </tr>
            <tr className="*:px-2">
              <td className="pt-2 border-l border-black">Occupation:</td>
              <td colSpan={3} className="border-x border-b border-black">{openViewModal?.fatherOccupation || 'N/A'}</td>
              <td colSpan={3} className="border-r border-b border-black">{openViewModal?.motherOccupation || 'N/A'}</td>
            </tr>
            <tr className="*:px-2 border-b border-black">
              <td className="pt-2 border-l border-black">Total Parents Income:</td>
              <td colSpan={6} className="border-x border-black">{openViewModal?.totalParentGrossIncome?.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) || 'N/A'}</td>
            </tr>
            <tr className="*:px-2 border border-black">
              <td colSpan={2} className="py-1">No. of Siblings in the family:</td>
              <td colSpan={5} className="font-[700]">{openViewModal?.siblings || 'N/A'}</td>
            </tr>
            <tr className="*:px-2 border border-black">
              <td colSpan={2} className="py-1">Are you enjoying other educational financial assistance?</td>
              <td colSpan={5} className="font-[700]">{openViewModal?.otherEducationalFinancialAssistance ? 'YES' : 'NO'}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end py-2 gap-x-2">
          <button type="button" onClick={onPrint} className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            <PrinterIcon className="w-4 h-4 inline" /> Print
          </button>
          <button type="button" onClick={onCloseViewModal} className="border border-gray-500 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </Modal>
  </>)
}