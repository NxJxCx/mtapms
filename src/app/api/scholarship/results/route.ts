'use server'

import { displayFullName } from "@app/components/display";
import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Requirement from "@app/models/Requirement";
import Schedule from "@app/models/Schedule";
import Student from "@app/models/Student";
import {
  RequirementModel,
  Roles,
  ScheduleModel,
  StudentModel,
  SubmissionStatus,
  YearLevel,
} from "@app/types";
import { isObjectIdOrHexString } from 'mongoose';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      const scheduleId = request.nextUrl.searchParams.get('id')
      if (isObjectIdOrHexString(scheduleId)) {
        const schedule = await Schedule.findById(scheduleId).lean<ScheduleModel>().exec()
        if (!!schedule?._id) {
          const students = await Student.find({ $and: [{ 'applicationForm.scheduleId': { $exists: true } }, { 'applicationForm.scheduleId': schedule._id.toString() }] }).select('-password').populate('applicationSubmission').populate('applicationSubmission.requirementId').lean<StudentModel[]>().exec()
          const results: any = await Promise.all(students.map(async (student) => ({
            ...student.applicationForm,
            _id: student._id?.toString(),
            studentId: student.studentId,
            fullName: displayFullName({ ...student, ...student.applicationForm } as any),
            grantee: student.isGrantee,
            orientation: schedule.orientationAttendance.some((attendance) => attendance.studentId.toString() === student._id?.toString()),
            exam: schedule.examScores.find((score) => score.studentId.toString() === student._id?.toString())?.percentageScore || 'N/A',
            submittedDocuments: `${(await Promise.all(student.applicationSubmission.map(async (submission: any) => ({
              ...submission,
              requirementId: (await Requirement.findById(submission.requirementId).lean<RequirementModel>().exec())
            })))).filter((submission: any) => (submission.requirementId as RequirementModel).scheduleId?.toString() === schedule._id?.toString() && submission.status === SubmissionStatus.Approved).length} / ${await Requirement.find({ scheduleId, forFirstYearOnly: student.applicationForm?.yearLevel == YearLevel.FirstYear }).countDocuments().exec()}`
          })))
          const results2 = results.map((result: any) => ({
            ...result,
            orientationPercentage: !!result.orientation ? 10 : 0,
            examPercentage: result.exam == 'N/A' ? 0 : parseFloat((parseFloat(result.exam.toString()) * 40 * 0.01).toFixed(3)),
            submittedDocumentsPercentage: parseInt(result.submittedDocuments.split(' / ')[1]) === 0 ? 0 : parseFloat((parseInt(result.submittedDocuments.split(' / ')[0]) / parseInt(result.submittedDocuments.split(' / ')[1]) * 0.5 * 100).toFixed(3)) ,
          }))
          const result3 = results2.map((result: any) => ({
            ...result,
            overallPercentage: parseFloat((result.orientationPercentage + result.examPercentage + result.submittedDocumentsPercentage).toFixed(3))
          }))
          result3.sort((a: any, b: any) => b.overallPercentage - a.totalPercentage)
          const data = result3.map((result: any, i: number) => ({
            ...result,
            rank: i + 1
          }))
          const filledSlots = data.filter((result: any) => !!result.grantee).length
          const totalSlots = schedule.scholarshipSlots
          const isOpenSlots = (new Date(schedule.range.startDate)).getTime() <= (new Date()).getTime() && (new Date(schedule.range.endDate)).getTime() >= (new Date()).getTime() && totalSlots > filledSlots
          return NextResponse.json({ data, filledSlots, totalSlots, isOpenSlots })
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return NextResponse.json({ data: [] })
}