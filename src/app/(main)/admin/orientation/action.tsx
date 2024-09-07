'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Schedule from "@app/models/Schedule";
import Student from "@app/models/Student";
import { ActionResponseInterface, Roles, ScheduleModel } from "@app/types";

export async function attendOrientation(academicYear: number, studentId: string): Promise<ActionResponseInterface>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      const schedule = await Schedule.findOne({ academicYear }).exec()
      const student = !!schedule?._id ? (await Student.findOne({ _id: studentId, 'applicationForm.scheduleId': schedule._id.toHexString() }).exec()) : null;
      if (!!student && !(schedule as ScheduleModel).orientationAttendance.map(student => student.studentId.toString()).some((studentId) => studentId === student._id.toString())) {
        schedule.orientationAttendance.push({ studentId: student._id.toString() })
        const updated = await schedule.save({ new: true, upsert: false, runValidators: true })
        const result = !!updated && updated.orientationAttendance.map((student: any) => student.studentId.toString()).some((studentId: string) => studentId === student._id.toString())
        return { success: result ? student.applicationForm.firstName + ' ' + student.applicationForm.lastName + ' (' + student.email + ') has attended' : undefined }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return { error: 'Failed to mark as attended' }
}