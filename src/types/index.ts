import { Document } from "mongoose";

export enum Roles {
  Applicant = 'applicant',
  Admin = 'admin',
  Grantee = 'grantee',
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

export enum CivilStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
}

export enum Semester {
  FirstSemester = 1,
  SecondSemester = 2,
}

export enum YearLevel {
  FirstYear = 1,
  SecondYear = 2,
  ThirdYear = 3,
  FourthYear = 4
}

export enum SubmissionStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Disapproved = 'Disapproved',
}

export enum GradeRemarks {
  Passed = 'Passed',
  Failed = 'Failed',
}

export enum MimeTypes {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  PDF = 'application/pdf',
}

export interface AdminModel extends Document {
  employeeId: string
  password: string
  firstName: string
  middleName?: string
  lastName: string
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface FileModel extends Document {
  file: string|Buffer,
  mimeType: MimeTypes,
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface SubmissionProps extends Document {
  photo?: string|FileModel
  status: SubmissionStatus
}

export interface GranteeModel extends Document {
  studentId: string|StudentModel
  academicYear: number
  semester: Semester
  COG: SubmissionProps,
  studyLoad: SubmissionProps,
  statementOfAccount: SubmissionProps,
  CONS: SubmissionProps,
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface RequirementProps {
  name: string
  description?: string
}

export interface RequirementModel {
  scheduleId: string|ScheduleModel
  name: string,
  description?: string,
  forFirstYearOnly: boolean,
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface RequirementSubmissionModel extends SubmissionProps, Document {
  requirementId: string|RequirementModel
  submittedBy: string|StudentModel
}

export interface ApplicationFormProps extends Document {
  scheduleId: string|ScheduleModel,
  lastName: string
  firstName: string
  middleName?: string
  dateOfBirth: string|Date
  placeOfBirth: string
  permanentAddress: string
  zipCode: string
  province: string
  presentAddress: string
  sex: Gender
  civilStatus: CivilStatus
  citizenship: string
  mobileNo: string
  nameOfSchoolAttended: string
  schoolAddress: string
  schoolSector: string
  yearLevel: YearLevel,
  course: string
  tribalMembership?: string
  typeOfDisability?: string
  fatherLiving: boolean
  fatherName: string
  fatherAddress: string
  fatherOccupation: string
  motherLiving: boolean
  motherName: string
  motherAddress: string
  motherOccupation: string
  totalParentGrossIncome: number
  siblings: number
  otherEducationalFinancialAssistance: boolean
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface StudentModel extends Document {
  email: string
  password: string
  emailVerified?: Date
  applicationForm?: ApplicationFormProps
  applicationSubmission: string[]|RequirementSubmissionModel[]
  isGrantee: boolean
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface AttendanceProps {
  studentId: string|StudentModel
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface ExamProps {
  studentId: string|StudentModel
  percentageScore: number
}

export interface ScheduleModel extends Document {
  academicYear: number
  range: {
    startDate: string|Date
    endDate: string|Date
  }
  orientationDate?: string|Date
  examDate?: string|Date
  interviewDate?: string|Date
  orientationAttendance: AttendanceProps[]
  examScores: ExamProps[]
  createdAt?: string|Date
  updatedAt?: string|Date
}

export interface ResultModel extends Document {
  studentId: string|StudentModel
  scheduleId: string|ScheduleModel
  grade: number
  remarks: GradeRemarks
  createdAt?: string|Date
  updatedAt?: string|Date
}