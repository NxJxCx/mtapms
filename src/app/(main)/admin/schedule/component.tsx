'use client'

import Buttons from "@app/components/buttons";
import { LoadingSpinnerFull } from "@app/components/loadings";
import { Modal } from "@app/components/modals";
import { useSidebar } from "@app/components/sidebar";
import Toaster from "@app/components/toaster";
import { ScheduleModel } from "@app/types";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { scheduleAction, scheduleUpdateAction } from "./action";

export default function SchedulePage() {
  const { openDrawer, toggleDrawer } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ScheduleModel[]>([])
  const schoolYearList = useMemo<number[]>(() => {
    let sylist: number[] = []
    if (data.length > 0) {
      sylist = data.map((item: ScheduleModel) => item.academicYear);
    }
    const thisYear: number = (new Date()).getFullYear();
    if (!sylist.includes(thisYear)) {
      sylist.unshift(thisYear);
    }
    sylist = sylist.sort((a: number, b: number) => b - a > 0 ? 1 : b - a < 0 ? -1 : 0);
    return sylist
  }, [data])
  const [schoolYear, setSchoolYear] = useState<number|string>((new Date()).getFullYear())
  const selectedScheduleData = useMemo<ScheduleModel|undefined>(() => {
    const d = data?.find((item: ScheduleModel) => item.academicYear === parseInt(schoolYear as string))
    if (!!d) {
      d.range.startDate = new Date(d.range.startDate)
      d.range.endDate = new Date(d.range.endDate)
    }
    if (!!d?.orientationDate) {
      d.orientationDate = new Date(d.orientationDate)
    }
    if (!!d?.examDate) {
      d.examDate = new Date(d.examDate)
    }
    if (!!d?.interviewDate) {
      d.interviewDate = new Date(d.interviewDate)
    }
    return d;
  }, [data, schoolYear])
  const getData = async () => {
    setLoading(true)
    const url = new URL('/api/schedule/data', window.location.origin)
    const response = await fetch(url)
    if (response.ok) {
      const { data } = await response.json()
      setData(data)
    }
    setLoading(false)
  }
  useEffect(() => {
    getData()
  }, [])

  const formRef = useRef<HTMLFormElement>(null)
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const handleCreateSchedule = useCallback(() => {
    setOpenCreate(true)
    if (openDrawer) {
      toggleDrawer()
    }
  }, [])

  const onCloseModal = useCallback(() => {
    formRef.current?.reset()
    setOpenCreate(false)
  }, [])
  const actionState = useMemo(() => scheduleAction.bind(null, parseInt(schoolYear as string)), [schoolYear])
  const [state, action, pending] = useFormState(actionState, undefined)

  useEffect(() => {
    if (!pending && !!state?.success) {
      onCloseModal()
      Toaster.success(state.success)
      setTimeout(getData, 100)
    } else if (!pending && !!state?.error) {
      Toaster.error(state.error)
    }
  }, [state, pending, onCloseModal])

  const updateScheduleAction = useMemo(() => scheduleUpdateAction.bind(null, parseInt(schoolYear as string)), [schoolYear])
  const [updateState, updateAction, updatePending] = useFormState(updateScheduleAction, undefined)
  const [openUpdate, setOpenUpdate] = useState<'Orientation'|'Examination'|'Interview'|undefined>()
  const formUpdateRef = useRef<HTMLFormElement>(null)
  const onCloseUpdateModal = useCallback(() => {
    formUpdateRef.current?.reset()
    setOpenUpdate(undefined)
  }, [])

  useEffect(() => {
    if (!updatePending && !!updateState?.success) {
      onCloseUpdateModal()
      Toaster.success(updateState.success)
      setTimeout(getData, 100)
    } else if (!updatePending && !!updateState?.error) {
      Toaster.error(updateState.error)
    }
  }, [updateState, updatePending, onCloseUpdateModal])

  const handleOpenUpdate = useCallback((update: 'Orientation'|'Examination'|'Interview'|undefined) => {
    setOpenUpdate(update)
    if (openDrawer) {
      toggleDrawer()
    }
  }, [])

  return (<>
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        SCHEDULES (A.Y. {schoolYear} - {parseInt(schoolYear as string) + 1})
      </div>
      <div>
        <label htmlFor="schoolYear" className="font-[500] text-[15px] mb-2 mr-2">Select School Year:</label>
        <select id="schoolYear" title="School Year" value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)} className="py-1 px-2 bg-white rounded text-center border border-black">
          {schoolYearList.map((sy: number) => (
            <option key={sy} value={sy}>{sy}</option>
          ))}
        </select>
      </div>
      { loading && <LoadingSpinnerFull />}
      { !loading && !selectedScheduleData && (
        <div className="flex flex-col items-center justify-center text-2xl font-[600] min-h-[200px] gap-y-3">
          <span>No Schedules Yet</span>
          <button type="button" onClick={handleCreateSchedule} className="bg-green-700 rounded-full px-4 py-2 text-green-50 text-lg hover:bg-green-600" title="Create Schedule Now!">Create Schedule Now!</button>
        </div>
      )}
      { !loading && !!selectedScheduleData && (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 mt-8 gap-x-4 gap-y-8">
          {/* Scholarship Schedule */}
          <div className="rounded-lg min-h-[150px] max-h-[150px] min-w-[450px] max-w-[400px] border border-black shadow bg-white">
            <div className="rounded-t-lg py-2 bg-[#2D2D2D] text-white text-center font-[700] text-[17px] leading-[29.5px] flex justify-center items-center">
              Scholarship Schedule for A.Y. {schoolYear} - {parseInt(schoolYear as string) + 1}
            </div>
            <div className="rounded-b-lg p-4 flex justify-center items-center h-full font-[500] text-[20px] leading-[20.5px] max-h-[100px] text-center">
              <div>{selectedScheduleData.range.startDate.toLocaleString('en-PH', { month: 'long', year: 'numeric', day: 'numeric' })} - {selectedScheduleData.range.endDate.toLocaleString('en-PH', { month: 'long', year: 'numeric', day: 'numeric' })}</div>
            </div>
          </div>
          {/* Orientation Schedule */}
          <div className="rounded-lg min-h-[150px] max-h-[150px] min-w-[450px] max-w-[400px] border border-black shadow bg-white">
            <div className="rounded-t-lg py-2 bg-[#2D2D2D] text-white text-center font-[700] text-[17px] leading-[29.5px] flex justify-center items-center relative">
              Orientation Schedule
              {!selectedScheduleData.orientationDate && (
                <div className="absolute right-2 top-0 w-10 h-full">
                  <button type="button" onClick={() => handleOpenUpdate('Orientation')} className="aspect-square text-white hover:text-green-500 flex items-center justify-center h-full" title="Create Schedule">
                    <PlusCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="rounded-b-lg p-4 flex justify-center items-center h-full font-[500] text-[20px] leading-[20.5px] max-h-[100px] text-center">
              <div>{selectedScheduleData.orientationDate?.toLocaleString('en-PH', { month: 'long', year: 'numeric', day: 'numeric', hour12: true, hour: "numeric", minute: "numeric" }) || 'No Schedule Yet'}</div>
            </div>
          </div>
          {/* Examination Schedule */}
          <div className="rounded-lg min-h-[150px] max-h-[150px] min-w-[450px] max-w-[400px] border border-black shadow bg-white">
            <div className="rounded-t-lg py-2 bg-[#2D2D2D] text-white text-center font-[700] text-[17px] leading-[29.5px] flex justify-center items-center relative">
              Examination Schedule
              {!selectedScheduleData.examDate && (
                <div className="absolute right-2 top-0 w-10 h-full">
                  <button type="button" onClick={() => handleOpenUpdate('Examination')} className="aspect-square text-white hover:text-green-500 flex items-center justify-center h-full" title="Create Schedule">
                    <PlusCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="rounded-b-lg p-4 flex justify-center items-center h-full font-[500] text-[20px] leading-[20.5px] max-h-[100px] text-center">
            <div>{selectedScheduleData.examDate?.toLocaleString('en-PH', { month: 'long', year: 'numeric', day: 'numeric', hour12: true, hour: "numeric", minute: "numeric" }) || 'No Schedule Yet'}</div>
            </div>
          </div>
          {/* Interview Schedule */}
          <div className="rounded-lg min-h-[150px] max-h-[150px] min-w-[450px] max-w-[400px] border border-black shadow bg-white">
            <div className="rounded-t-lg py-2 bg-[#2D2D2D] text-white text-center font-[700] text-[17px] leading-[29.5px] flex justify-center items-center relative">
              Interview Schedule
              {!selectedScheduleData.interviewDate && (
                <div className="absolute right-2 top-0 w-10 h-full">
                  <button type="button" onClick={() => handleOpenUpdate('Interview')} className="aspect-square text-white hover:text-green-500 flex items-center justify-center h-full" title="Create Schedule">
                    <PlusCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="rounded-b-lg p-4 flex justify-center items-center h-full font-[500] text-[20px] leading-[20.5px] max-h-[100px] text-center">
            <div>{selectedScheduleData.interviewDate?.toLocaleString('en-PH', { month: 'long', year: 'numeric', day: 'numeric', hour12: true, hour: "numeric", minute: "numeric" }) || 'No Schedule Yet'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Modal title={"Create Schedule for A.Y. " + schoolYear + " - " + (parseInt(schoolYear as string) + 1)} open={openCreate} onClose={onCloseModal}>
      {/* Add Schedule Form */}
      <form action={action} ref={formRef} className="min-w-[500px] p-4 flex flex-col gap-y-2">
        <h2 className="text-xl font-[600]">Scholarship Application Schedule</h2>
        <div>
          <label htmlFor="range.startDate">Start Date:</label>
          <input type="date" id="range.startDate" name="range.startDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" required />
        </div>
        <div>
          <label htmlFor="range.endDate">End Date:</label>
          <input type="date" id="range.endDate" name="range.endDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" required />
        </div>
        <h2 className="text-xl font-[600] mt-4">Orientation Schedule</h2>
        <div>
          <label htmlFor="orientationDate">Orientation Date: <span className="italic text-sm">(leave blank if not decided yet)</span></label>
          <input type="date" id="orientationDate" name="orientationDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" />
        </div>

        <h2 className="text-xl font-[600] mt-4">Examination Schedule</h2>
        <div>
          <label htmlFor="examDate">Examination Date: <span className="italic text-sm">(leave blank if not decided yet)</span></label>
          <input type="date" id="examDate" name="examDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" />
        </div>

        <h2 className="text-xl font-[600] mt-4">Interview Schedule</h2>
        <div>
          <label htmlFor="interviewDate">Interview Date: <span className="italic text-sm">(leave blank if not decided yet)</span></label>
          <input type="date" id="interviewDate" name="interviewDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" />
        </div>
        <div className="mt-4">
          <Buttons.SignupButton type="submit" label="Create Schedule" />
        </div>
      </form>
      {/* Add Schedule Form End */}
    </Modal>
    <Modal title={"Create " + openUpdate + " Schedule for A.Y. " + schoolYear + " - " + (parseInt(schoolYear as string) + 1)} open={!!openUpdate} onClose={onCloseUpdateModal}>
      {/* Add Schedule Form */}
      <form action={updateAction} ref={formRef} className="min-w-[500px] p-4 flex flex-col gap-y-2">
        { openUpdate === 'Orientation' && (<>
          <label htmlFor="orientationDate" className="text-xl font-[600] mt-4">Orientation Schedule</label>
          <input type="date" id="orientationDate" name="orientationDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" required />
        </>)}
        { openUpdate === 'Examination' && (<>
          <label htmlFor="examDate" className="text-xl font-[600] mt-4">Examination Schedule</label>
          <input type="date" id="examDate" name="examDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" required />
        </>)}
        { openUpdate === 'Interview' && (<>
          <label htmlFor="interviewDate" className="text-xl font-[600] mt-4">Interview Schedule</label>
          <input type="date" id="interviewDate" name="interviewDate" min={(new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1).toString().padStart(2, '0') + "-" + ((new Date()).getDate()).toString().padStart(2, '0')} className="block px-2 py-1 border border-black rounded-lg" required />
        </>)}
        <div className="mt-4">
          <Buttons.SignupButton type="submit" label="Create Schedule" />
        </div>
      </form>
      {/* Add Schedule Form End */}
    </Modal>
  </>)
}