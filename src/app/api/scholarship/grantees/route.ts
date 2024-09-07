'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Grantee from "@app/models/Grantee";
import Schedule from "@app/models/Schedule";
import Student from "@app/models/Student";
import {
  ApplicationFormProps,
  GranteeModel,
  RequirementModel,
  RequirementSubmissionModel,
  Roles,
  ScheduleModel,
  Semester,
  StudentModel,
  YearLevel,
} from "@app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await mongodbConnect()
  try {
    const session = await getSession();
    if (session?.user?.role === Roles.Admin) {
      const academicYear = parseInt(request.nextUrl.searchParams.get('academicYear') as string) || (new Date()).getFullYear()
      const semester = request.nextUrl.searchParams.get('semester') as Semester|null
      const type = request.nextUrl.searchParams.get('type') as string
      const schedule = await Schedule.findOne({ academicYear }).exec()
      if (!!schedule?._id) {
        const filter: any = { isGrantee: true }
        if (type === 'new_firstYear') {
          filter.$and = [{ applicationForm: { $exists: true } }, { 'applicationForm.scheduleId': schedule._id.toHexString() }, { 'applicationForm.yearLevel': YearLevel.FirstYear }]
        } else if (type === 'new') {
          filter.$and = [{ applicationForm: { $exists: true } }, { 'applicationForm.scheduleId': schedule._id.toHexString() }, { 'applicationForm.yearLevel': { $ne: YearLevel.FirstYear }}]
        } else {
          filter.applicationForm = { $exists: true }
        }
        const students = await Student.find(filter).select('email applicationForm isGrantee applicationSubmission').populate('applicationForm.scheduleId applicationSubmission applicationSubmission.requirementId').lean<StudentModel[]>().exec()
        const mappedStudents = await Promise.all(students.filter((st: StudentModel) => {
          const sched = ((st.applicationForm as ApplicationFormProps).scheduleId as ScheduleModel);
          return sched.academicYear >= academicYear
        })
          .map(async (st: StudentModel) => ({...st, granteeSubmissions: (await Grantee.findOne({ academicYear, semester, studentId: st._id?.toString() }).exec())})))
        const data: (StudentModel & { granteeSubmissions?: GranteeModel })[] =
          type === 'grantee'
          ? mappedStudents.filter((st: StudentModel & { granteeSubmissions?: GranteeModel }) => !!st.granteeSubmissions).map((st: StudentModel & { granteeSubmissions?: GranteeModel }) => ({ ...st, applicationSubmission: [] }))
          : type === 'new_firstYear'
          ? mappedStudents.filter((st: StudentModel) => {
              const sched = ((st.applicationForm as ApplicationFormProps).scheduleId as ScheduleModel);
              return sched.academicYear === academicYear && (st.applicationForm as ApplicationFormProps).yearLevel === YearLevel.FirstYear
            }).map((st: StudentModel) => ({...st, applicationSubmission: (st.applicationSubmission as RequirementSubmissionModel[]).filter((req: RequirementSubmissionModel) => (req.requirementId as RequirementModel).forFirstYearOnly) }))
          : type === 'new'
          ? students.filter((st: StudentModel) => {
            const sched = ((st.applicationForm as ApplicationFormProps).scheduleId as ScheduleModel);
            return sched.academicYear === academicYear && (st.applicationForm as ApplicationFormProps).yearLevel === YearLevel.FirstYear
          }).map((st: StudentModel) => ({...st, applicationSubmission: (st.applicationSubmission as RequirementSubmissionModel[]).filter((req: RequirementSubmissionModel) => !(req.requirementId as RequirementModel).forFirstYearOnly) }))
          : []
        console.log(semester, type, academicYear)
        console.log("DATA", data)
        return NextResponse.json({ data })
      }
    }
  } catch (e) {
    console.log(e)
  }
  return NextResponse.json({ data: [] })
}