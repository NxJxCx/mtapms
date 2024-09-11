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
      const action = request.nextUrl.searchParams.get('action')
      const selection = 'academicYear range orientationDate examDate interviewDate' + (action === 'scheduleandresult' ? ' examScores' : '')
      const result = await Schedule.find({}).select(selection).lean<ScheduleModel[]>().exec()
      result.sort((a, b) => b.academicYear - a.academicYear)
      const dataRecent: ScheduleModel = result?.[0] || null
      if (!!dataRecent) {
        const recentStartDate = new Date(dataRecent?.range.startDate)
        recentStartDate.setHours(0, 0, 0, 0)
        const recentEndDate = new Date(dataRecent?.range.endDate)
        recentEndDate.setHours(0, 0, 0, 0)
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const data = !!dataRecent && recentStartDate.getTime() <= now.getTime() && recentEndDate.getTime() >= now.getTime() ? dataRecent : null
        if (!!data) {
          const student = await Student.findById(session.user._id).exec()
          if ((action === 'documents' || action === 'scheduleandresult') && !!student && student?.applicationForm?.scheduleId.toString() === data._id!.toString()) {
            return NextResponse.json({ data })
          } else  if (!student?.applicationForm && student?.applicationForm?.scheduleId.toString() !== data._id as string) {
            return NextResponse.json({ data })
          } else if (!!student && student?.applicationForm?.scheduleId.toString() === data._id!.toString()) {
            return NextResponse.json({ data: true })
          }
        }
      }
    } else if (session?.user?.role === Roles.Admin) {
      const result = await Schedule.find({}).select('academicYear range orientationDate examDate interviewDate').exec()
      const data: ScheduleModel = result.length === 0 ? null : JSON.parse(JSON.stringify(result)).reduce((init: ScheduleModel, item: ScheduleModel) => !init ? item : item.academicYear > init.academicYear ? item : init, null)
      return NextResponse.json({ data })
    }
  } catch (e) {
    console.log(e)
  }
  return NextResponse.json({ data: null })
}