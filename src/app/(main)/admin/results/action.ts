'use server'

import mongodbConnect from "@app/lib/db"
import { getSession } from "@app/lib/session"
import Schedule from "@app/models/Schedule"
import Student from "@app/models/Student"
import { ActionResponseInterface, Roles } from "@app/types"

export async function grantScholarship(scheduleId: string, studentId: string): Promise<ActionResponseInterface>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      const student = await Student.findById(studentId).exec()
      const schedule = await Schedule.findById(scheduleId).select('scholarshipSlots').exec()
      if (!!student?._id && !student.isGrantee && !!schedule?._id) {
        const studentGrantees = await Student.find({ isGrantee: true, $and: [{ 'applicationForm.scheduleId': { $exists: true } },{ 'applicationForm.scheduleId': schedule._id.toString() }]}).countDocuments().exec()
        if (studentGrantees < schedule.scholarshipSlots) {
          student.isGrantee = true
          const updated = await student.save({ new: true, runValidators: true })
          if (!!updated?._id && updated.isGrantee) {
            return { success: 'Scholarship granted successfully.' }
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return {
    error: 'Failed to Grant Scholarship. Please try again.'
  }
}