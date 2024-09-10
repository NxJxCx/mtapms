'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Student from "@app/models/Student";
import { ActionResponse, Roles } from "@app/types";

export async function ScholarshipApplicationAction(scheduleId: string, prevState: ActionResponse, formData: FormData): Promise<ActionResponse>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Applicant) {
      const data = Object.fromEntries(Object.entries(Object.fromEntries(formData.entries())).map(([key, value]: [string, any]) => [key, (key === 'fatherLiving' || key === 'motherLiving' || key === 'otherEducationalFinancialAssistance') ? (value === 'on' ? true : false) : value]))
      data.scheduleId = scheduleId
      const applicant = await Student.findById(session.user._id).exec()
      if (!!applicant?._id) {
        applicant.applicationForm = { ...data }
        const updated = await applicant.save({ new: true, upsert: false, runValidators: true })
        if (!!updated) {
          return {
            success: 'Successfully saved application form'
          }
        } else {
          return {
            error: 'Failed to save application form. Please try again later.'
          }
        }
      } else {
        return {
          error: 'Failed to save application form. Please try again later.'
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