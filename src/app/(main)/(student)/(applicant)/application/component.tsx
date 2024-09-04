'use client';;
import Buttons from "@app/components/buttons";
import { LoadingFull } from "@app/components/loadings";
import Toaster from "@app/components/toaster";
import { ApplicationFormProps, CivilStatus, Gender, ScheduleModel, YearLevel } from "@app/types";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { ScholarshipApplicationAction } from "./action";

export default function ApplicationComponent() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ScheduleModel|true>()
  const fetchData = () => {
    setLoading(true)
    const url = new URL('/api/schedule/now', window.location.origin)
    fetch(url)
      .then(response => response.json())
      .then(({ data }) => { setData(data); setLoading(false); })
      .catch((e) => { console.log(e); setLoading(false); })
  }

  useEffect(() => {
    fetchData();
  }, [])

  const scheduleId = useMemo(() => data !== true ? data?._id || '' : '', [data])

  const [formData, setFormData] = useState<ApplicationFormProps>({
    scheduleId,
    lastName: '',
    firstName: '',
    middleName: '',
    maidenName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    permanentAddress: '',
    zipCode: '',
    province: '',
    presentAddress: '',
    sex: Gender.Male,
    civilStatus: CivilStatus.Single,
    citizenship: '',
    mobileNo: '',
    nameOfSchoolAttended: '',
    schoolAddress: '',
    schoolSector: '',
    yearLevel: YearLevel.FirstYear,
    course: '',
    fatherLiving: false,
    fatherName: '',
    fatherAddress: '',
    fatherOccupation: '',
    motherLiving: false,
    motherName: '',
    motherAddress: '',
    motherOccupation: '',
    totalParentGrossIncome: 0,
    siblings: 0,
    otherEducationalFinancialAssistance: false,
  })

  const actionBind = useMemo(() => ScholarshipApplicationAction.bind(null, scheduleId), [scheduleId])
  const [state, action, pending] = useFormState(actionBind, undefined)
  useEffect(() => {
    if (!pending && state?.success) {
      Toaster.success(state?.success)
      setTimeout(fetchData, 500)
    } else if (!pending && state?.error) {
      Toaster.error(state?.error)
    }
  }, [state, pending])

  return loading ? <LoadingFull /> : (
    <div className="min-h-[600px] flex flex-col items-center justify-center">
      {!data && (
        <div className="text-xl italic text-gray-500 text-center w-full mt-4">
          <p className="text-center w-full">No Schedule for Scholarship. Come back next time for updates.</p>
        </div>
      )}
      {data === true && (
        <div className="text-xl italic text-gray-500 text-center w-full mt-4">
          <p className="text-center w-full">Showing Application Form for printing or display only here...</p>
        </div>
      )}
      {data !== true && !!data && (<>
        <h1 className="text-2xl font-[600] mt-4">Scholarship Application Form</h1>
        <form action={action} className="mt-4 border px-16 py-8 bg-white rounded-lg shadow mb-4">
          <div className="grid grid-cols-3 gap-x-3 gap-y-2">
            <div>
              <label htmlFor="lastName" className="font-[500]">Last Name:</label>
              <input type="text" id="lastName" name="lastName" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="firstName" className="font-[500]">First Name:</label>
              <input type="text" id="firstName" name="firstName" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="middleName" className="font-[500]">Middle Name:</label>
              <input type="text" id="middleName" name="middleName" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value })} />
            </div>
            { formData.civilStatus === CivilStatus.Married && formData.sex === Gender.Female && (<>
              <div>
                <label htmlFor="middleName" className="font-[500]">Maiden Name for Married Women:</label>
                <input type="text" id="middleName" name="middleName" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.maidenName} onChange={(e) => setFormData({...formData, maidenName: e.target.value })} required />
              </div>
              <div />
              <div />
            </>)}
            <div>
              <label htmlFor="dateOfBirth" className="font-[500]">Date of Birth:</label>
              <input type="date" id="dateOfBirth" name="dateOfBirth" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.dateOfBirth as string} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="placeOfBirth" className="font-[500]">Place of Birth:</label>
              <input type="text" id="placeOfBirth" name="placeOfBirth" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.placeOfBirth} onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="permanentAddress" className="font-[500]">Permanent Address:</label>
              <input type="text" id="permanentAddress" name="permanentAddress" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.permanentAddress} onChange={(e) => setFormData({...formData, permanentAddress: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="zipCode" className="font-[500]">Zip Code:</label>
              <input type="text" id="zipCode" name="zipCode" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="province" className="font-[500]">Province:</label>
              <input type="text" id="province" name="province" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="presentAddress" className="font-[500]">Present Address:</label>
              <input type="text" id="presentAddress" name="presentAddress" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.presentAddress} onChange={(e) => setFormData({...formData, presentAddress: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="sex" className="font-[500]">Sex:</label>
              <select id="sex" name="sex" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.sex} onChange={(e) => setFormData({...formData, sex: e.target.value as Gender })} required>
                <option value={Gender.Male}>Male</option>
                <option value={Gender.Female}>Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="civilStatus" className="font-[500]">Civil Status:</label>
              <select id="civilStatus" name="civilStatus" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.civilStatus} onChange={(e) => setFormData({...formData, civilStatus: e.target.value as CivilStatus })} required>
                <option value={CivilStatus.Single}>Single</option>
                <option value={CivilStatus.Married}>Married</option>
                <option value={CivilStatus.Divorced}>Divorced</option>
                <option value={CivilStatus.Widowed}>Widowed</option>
              </select>
            </div>
            <div>
              <label htmlFor="citizenship" className="font-[500]">Citizenship:</label>
              <input type="text" id="citizenship" name="citizenship" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.citizenship} onChange={(e) => setFormData({...formData, citizenship: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="mobileNo" className="font-[500]">Mobile Number:</label>
              <input type="tel" id="mobileNo" name="mobileNo" className="block border border-black px-2 py-1 rounded flex-grow w-full" minLength={10} maxLength={13} value={formData.mobileNo} onChange={(e) => setFormData({...formData, mobileNo: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="nameOfSchoolAttended" className="font-[500]">Name of School Attended:</label>
              <input type="tel" id="nameOfSchoolAttended" name="nameOfSchoolAttended" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.nameOfSchoolAttended} onChange={(e) => setFormData({...formData, nameOfSchoolAttended: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="schoolAddress" className="font-[500]">School Address:</label>
              <input type="text" id="schoolAddress" name="schoolAddress" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.schoolAddress} onChange={(e) => setFormData({...formData, schoolAddress: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="schoolSector" className="font-[500]">School Sector:</label>
              <input type="text" id="schoolSector" name="schoolSector" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.schoolSector} onChange={(e) => setFormData({...formData, schoolSector: e.target.value })} required />
            </div>
            <div>
              <label htmlFor="yearLevel" className="font-[500]">Year Level:</label>
              <select id="yearLevel" name="yearLevel" value={formData.yearLevel} onChange={(e) => setFormData({...formData, yearLevel: e.target.value !== '' ? parseInt(e.target.value) : 1 })} title="Year Level" className="block border border-black px-2 py-1 rounded flex-grow w-full">
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
            <div>
              <label htmlFor="course" className="font-[500]">Course:</label>
              <input type="text" id="course" name="course" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value })} required />
            </div>
            <div className="col-span-3">
              <label htmlFor="fatherLiving" className="font-[500] mr-1">Is your Father living?</label>
              <input type="checkbox" id="fatherLiving" name="fatherLiving" className="cursor-pointer" checked={formData.fatherLiving} onChange={(e) => setFormData({...formData, fatherLiving: e.target.checked })} />
              <span className="ml-1 font-bold">{formData.fatherLiving ? 'Yes, living' : 'No, deceased'}</span>
            </div>
            { !!formData.fatherLiving && (<>
              <div>
                <label htmlFor="fatherName" className="font-[500]">{"Father's"} Name:</label>
                <input type="text" id="fatherName" name="fatherName" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="fatherAddress" className="font-[500]">Father Address:</label>
                <input type="text" id="fatherAddress" name="fatherAddress" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.fatherAddress} onChange={(e) => setFormData({...formData, fatherAddress: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="fatherOccupation" className="font-[500]">Father Occupation:</label>
                <input type="text" id="fatherOccupation" name="fatherOccupation" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.fatherOccupation} onChange={(e) => setFormData({...formData, fatherOccupation: e.target.value })} required />
              </div>
            </>)}
            <div className="col-span-3">
              <label htmlFor="motherLiving" className="font-[500] mr-1">Is your Mother Living?</label>
              <input type="checkbox" id="motherLiving" name="motherLiving" className="cursor-pointer" checked={formData.motherLiving} onChange={(e) => setFormData({...formData, motherLiving: e.target.checked })} />
              <span className="ml-1 font-bold">{formData.fatherLiving ? 'Yes, living' : 'No, deceased'}</span>
            </div>
            { !!formData.motherLiving && (<>
              <div>
                <label htmlFor="motherName" className="font-[500]">{"Mother's"} Name:</label>
                <input type="text" id="motherName" name="motherName" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="motherAddress" className="font-[500]">Mother Address:</label>
                <input type="text" id="motherAddress" name="motherAddress" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.motherAddress} onChange={(e) => setFormData({...formData, motherAddress: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="motherOccupation" className="font-[500]">Mother Occupation:</label>
                <input type="text" id="motherOccupation" name="motherOccupation" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.motherOccupation} onChange={(e) => setFormData({...formData, motherOccupation: e.target.value })} required />
              </div>
            </>)}
            <div>
              <label htmlFor="totalParentGrossIncome" className="font-[500]">Total Parent Gross Income:</label>
              <input type="number" min={0} id="totalParentGrossIncome" name="totalParentGrossIncome" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.totalParentGrossIncome} onChange={(e) => setFormData({ ...formData, totalParentGrossIncome: e.target.value !== '' ? parseFloat(e.target.value) : 0 })} required />
            </div>
            <div>
              <label htmlFor="siblings" className="font-[500]">Number of Siblings:</label>
              <input type="number" min={0} max={15} id="siblings" name="siblings" className="block border border-black px-2 py-1 rounded flex-grow w-full" value={formData.siblings} onChange={(e) => setFormData({ ...formData, siblings: e.target.value !== '' ? parseInt(e.target.value) : 0 })} required />
            </div>
            <div className="col-span-3">
              <label htmlFor="otherEducationalFinancialAssistance" className="font-[500] max-w-32 text-wrap cursor-pointer mr-2">Are you enjoying other educational financial assistance?</label>
              <input type="checkbox" id="otherEducationalFinancialAssistance" name="otherEducationalFinancialAssistance" className="cursor-pointer" checked={formData.otherEducationalFinancialAssistance} onChange={(e) => setFormData({ ...formData, otherEducationalFinancialAssistance: e.target.checked })} />
              <span className="ml-1 font-bold">{formData.otherEducationalFinancialAssistance ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="max-w-64 mx-auto mt-4">
            <Buttons.SignupButton type="submit" label={"Apply for Scholarship"} />
          </div>
        </form>
      </>)}
    </div>
  )
}