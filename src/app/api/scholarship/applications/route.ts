'use server'

import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Schedule from "@app/models/Schedule";
import Student from "@app/models/Student";
import { Roles } from "@app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await mongodbConnect()
  try {
    const session = await getSession();
    if (session?.user?.role === Roles.Admin) {
      const academicYear = parseInt(request.nextUrl.searchParams.get('academicYear') as string) || (new Date()).getFullYear()
      const schedule = await Schedule.findOne({ academicYear }).exec()
      if (!!schedule?._id) {
        const data = await Student.find({ 'applicationForm.scheduleId': schedule._id.toString(), isGrantee: false }).select('email applicationForm').exec()
        return NextResponse.json({ data })
      }
    }
  } catch (e) {
    console.log(e)
  }
  return NextResponse.json({ data: [] })
}