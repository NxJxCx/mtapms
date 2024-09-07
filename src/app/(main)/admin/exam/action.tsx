'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Schedule from "@app/models/Schedule";
import Student from "@app/models/Student";
import { ActionResponseInterface, Roles, ScheduleModel } from "@app/types";

export async function addExamScore(academicYear: number, studentId: string, scoreGrade: string): Promise<ActionResponseInterface>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      const schedule = await Schedule.findOne({ academicYear }).exec()
      const student = !!schedule?._id ? (await Student.findOne({ _id: studentId, 'applicationForm.scheduleId': schedule._id.toHexString() }).exec()) : null;
      if (!!student && !(schedule as ScheduleModel).examScores.map(student => student.studentId.toString()).some((studentId) => studentId === student._id.toString())) {
        schedule.examScores.push({ studentId: student._id.toString(), percentageScore: scoreGrade })
        const updated = await schedule.save({ new: true, upsert: false, runValidators: true })
        const result = !!updated && updated.examScores.map((st: any) => ({ studentId: st.studentId.toHexString(), score: parseFloat(st.percentageScore) }))
          .some((st: any) => st.studentId === student._id.toHexString() && st.score === parseFloat(scoreGrade))
        return { success: result ? student.applicationForm.firstName + ' ' + student.applicationForm.lastName + ' (' + student.email + ")'s exam score has been set" : undefined }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return { error: 'Failed to set exam score' }
}