'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Schedule from "@app/models/Schedule";
import Student from "@app/models/Student";
import { Roles, ScheduleModel } from "@app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Applicant) {
      const result: ScheduleModel = await Schedule.findOne({ academicYear: (new Date()).getFullYear() }).select('academicYear range orientationDate examDate interviewDate').exec()
      const data = !!result && (new Date(result.range.startDate)).getTime() <= (new Date()).getTime() && (new Date(result.range.endDate)).getTime() >= (new Date()).getTime() ? result : null
      if (!!data) {
        const student = await Student.findById(session.user._id).exec()
        if (!student.applicationForm || student.applicationForm.scheduleId.toString() !== data._id!.toString()) {
          return NextResponse.json({ data })
        } else if (!!student && student.applicationForm.scheduleId.toString() === data._id!.toString()) {
          return NextResponse.json({ data: true })
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return NextResponse.json({ data: null })
}