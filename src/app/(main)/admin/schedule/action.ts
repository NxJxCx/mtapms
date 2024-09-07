'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Schedule from "@app/models/Schedule";
import { ActionResponse, Roles } from "@app/types";

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
      const data = {
        academicYear,
        range: {
          startDate: dataForm['range.startDate'],
          endDate: dataForm['range.endDate'],
        },
        orientationDate: dataForm.orientationDate,
        examDate: dataForm.examDate,
        interviewDate: dataForm.interviewDate,
      }
      const result = await Schedule.create(data);
      if (!!result?._id) {
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