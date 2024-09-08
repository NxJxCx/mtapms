'use server';
import mongodbConnect from "@app/lib/db";
import { getSession } from "@app/lib/session";
import Requirement from "@app/models/Requirement";
import Schedule from "@app/models/Schedule";
import { Roles } from "@app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await mongodbConnect()
  try {
    const session = await getSession();
    if (session?.user?.role === Roles.Admin) {
      const academicYear = parseInt(request.nextUrl.searchParams.get('academicYear') as string) || (new Date()).getFullYear()
      const forFirstYearOnly = request.nextUrl.searchParams.get('firstYearOnly') === 'true' ? true : request.nextUrl.searchParams.get('firstYearOnly') === 'false' ? false : undefined;
      const schedule = await Schedule.findOne({ academicYear }).exec()
      if (!!schedule?._id) {
        const filter: any = { scheduleId: schedule._id.toString() }
        if (forFirstYearOnly !== undefined) {
          filter.forFirstYearOnly = forFirstYearOnly
        }
        const data = await Requirement.find(filter).exec()
        return NextResponse.json({ data })
      }
    }
  } catch (e) {
    console.log(e)
  }
  return NextResponse.json({ data: [] })
}