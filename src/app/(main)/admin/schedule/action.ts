'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Grantee from "@app/models/Grantee";
import Schedule from "@app/models/Schedule";
import Student from "@app/models/Student";
import { ActionResponse, Roles, ScheduleModel, Semester, StudentModel } from "@app/types";

export async function scheduleAction(academicYear: number, prevState: ActionResponse, formData: FormData): Promise<ActionResponse>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      // check first if already has schedule
      const dataForm = Object.fromEntries(formData.entries())
      const sched = await Schedule.exists({ academicYear }).exec()
      if (!!sched?._id) {
        return {
          error: 'Schedule already set'
        }
      }
      if (!dataForm['range.startDate'] || !dataForm['range.endDate']) {
        return {
          error: 'Scholarship Range Date Required'
        }
      }
      if (!dataForm.scholarshipSlots) {
        return {
          error: 'Scholarship Slots Required'
        }
      }
      const startDate = new Date(dataForm['range.startDate'] as string)
      const endDate = new Date(dataForm['range.endDate'] as string)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)
      let orientationDate, examDate, interviewDate;
      if (dataForm.orientationDate) {
        orientationDate = new Date(dataForm.orientationDate as string)
        orientationDate.setHours(0, 0, 0, 0)
      }
      if (dataForm.examDate) {
        examDate = new Date(dataForm.examDate as string)
        examDate.setHours(0, 0, 0, 0)
      }
      if (dataForm.interviewDate) {
        interviewDate = new Date(dataForm.interviewDate as string)
        interviewDate.setHours(0, 0, 0, 0)
      }
      const scholarshipSlots = dataForm.scholarshipSlots as string
      const data = {
        academicYear,
        range: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        orientationDate: orientationDate?.toISOString(),
        examDate: examDate?.toISOString(),
        interviewDate: interviewDate?.toISOString(),
        scholarshipSlots
      }
      const result = await Schedule.create(data);
      if (!!result?._id) {
        // initiate all grantees for their requirement submission
        const grantees = await Student.find({ isGrantee: true, 'applicationForm.scheduleId': { $exists: true } }).select('_id').lean<StudentModel[]>()
        await Promise.all(grantees.map(async (grantee: StudentModel) => {
          const sched = await Schedule.findById(grantee.applicationForm!.scheduleId.toString()).lean<ScheduleModel>().exec()
          if (!!sched?._id && (academicYear - sched.academicYear) < (4 - grantee.applicationForm!.yearLevel)) {
            await Grantee.create({
              studentId: grantee._id,
              academicYear,
              semester: Semester.FirstSemester,
            })
          }
        }))
        return {
          success: 'Successfully Schedule Scholarship Application Date'
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return {
    error: 'Bad Request'
  }
}

export async function scheduleUpdateAction(academicYear: number, prevState: ActionResponse, formData: FormData): Promise<ActionResponse>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      const dataForm = Object.fromEntries(formData.entries())
      const schedule = await Schedule.findOne({ academicYear }).exec()
      if (!schedule?._id) {
        return {
          error: 'Schedule not found'
        }
      }
      const dataSet = {
        orientationDate: dataForm.orientationDate,
        examDate: dataForm.examDate,
        interviewDate: dataForm.interviewDate,
      }
      const $set = Object.fromEntries(Object.entries(dataSet).filter(([key, value]) => !!value && value))
      const result = await Schedule.findByIdAndUpdate(schedule?._id, { $set }, { new: true, upsert: false, runValidators: true }).exec();
      if (!!result?._id) {
        return {
          success: 'Successfully Update Schedule'
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return {
    error: 'Bad Request'
  }
}