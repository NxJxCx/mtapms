'use server'

import mongodbConnect from "@app/lib/db"
import Student from "@app/models/Student"
import { ScheduleModel, StudentModel } from "@app/types"

export async function fetchPrintData(template: string, { ...args }: any) {
  await mongodbConnect()
  if (template === 'application') {
    const academicYear = parseInt(args.academicYear as string) || (new Date()).getFullYear()
    const studentId = args.studentId as string
    const student = await Student.findOne({ _id: studentId }).select('-applicationSubmission -password -emailVerified').populate('applicationForm.scheduleId').lean<StudentModel>().exec()
    if (!!student?._id) {
      const ay = 'A.Y. ' + academicYear + ' - ' + (academicYear + 1)
      if ((student.applicationForm!.scheduleId as ScheduleModel)?.academicYear === academicYear) {
        const data = ({
          ...student,
          ...student.applicationForm,
          academicYear: ay,
          studentId: student._id
        })
        delete data.applicationForm
        delete data.scheduleId
        return JSON.parse(JSON.stringify(data))
      }
    }
    return {}
  }
}