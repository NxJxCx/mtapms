'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Grantee from "@app/models/Grantee";
import RequirementSubmission from "@app/models/RequirementSubmission";
import { ActionResponseInterface, Roles, SubmissionStatus } from "@app/types";

export async function approvePendingSubmission(type: 'new'|'new_firstYear'|'grantee', id: string, name: string): Promise<ActionResponseInterface>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      const Model = type === 'grantee' ? Grantee : RequirementSubmission
      const submission = await Model.findById(id).exec()
      if (!!submission) {
        if (type === 'grantee') {
          submission[name].status = SubmissionStatus.Approved
        } else {
          submission.status = SubmissionStatus.Approved
        }
        const updated = await submission.save()
        if (!!updated?._id && (updated[name]?.status === SubmissionStatus.Approved || updated.status === SubmissionStatus.Approved)) {
          return {
            success: `Successfully approved submission of ${name}`,
          }
        }
      } else {
        return {
          error: 'Submission not found',
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
  return {
    error: 'Failed to approve submission'
  }
}

export async function disapprovePendingSubmission(type: 'new'|'new_firstYear'|'grantee', id: string, name: string): Promise<ActionResponseInterface>
{
  await mongodbConnect()
  try {
    const session = await getSession()
    if (session?.user?.role === Roles.Admin) {
      const Model = type === 'grantee' ? Grantee : RequirementSubmission
      const submission = await Model.findById(id).exec()
      if (!!submission) {
        if (type === 'grantee') {
          submission[name].status = SubmissionStatus.Disapproved
        } else {
          submission.status = SubmissionStatus.Disapproved
        }
        const updated = await submission.save()
        if (!!updated?._id && (updated[name]?.status === SubmissionStatus.Disapproved || updated.status === SubmissionStatus.Disapproved)) {
          return {
            success: `Successfully disapproved submission of ${name}`,
          }
        }
      } else {
        return {
          error: 'Submission not found',
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
  return {
    error: 'Failed to disapprove submission'
  }
}