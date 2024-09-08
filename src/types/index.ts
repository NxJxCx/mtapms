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

export enum SchoolSector {
  Public = 'Public',
  Private = 'Private',
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
export interface BaseDocument {
  _id?: string;
  createdAt?: string|Date
  updatedAt?: string|Date
}
export interface AdminModel extends BaseDocument {
  employeeId: string
  password: string
  firstName: string
  middleName?: string
  lastName: string
}

export interface FileDocumentModel extends BaseDocument {
  file: string|Buffer,
  mimeType: MimeTypes
}

export interface SubmissionProps extends BaseDocument {
  photo?: string|FileDocumentModel
  status: SubmissionStatus
}

export interface GranteeModel extends BaseDocument {
  studentId: string|StudentModel
  academicYear: number
  semester: Semester
  COG: SubmissionProps,
  studyLoad: SubmissionProps,
  statementOfAccount: SubmissionProps,
  CONS: SubmissionProps,
}

export interface RequirementProps {
  name: string
  description?: string
}

export interface RequirementModel extends BaseDocument {
  scheduleId: string|ScheduleModel
  name: string,
  description?: string,
  forFirstYearOnly: boolean,
}

export interface RequirementSubmissionModel extends SubmissionProps {
  requirementId: string|RequirementModel
  submittedBy: string|StudentModel
}

export interface ApplicationFormProps extends BaseDocument {
  scheduleId: string|ScheduleModel,
  lastName: string
  firstName: string
  middleName?: string
  maidenName?: string
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
  schoolSector: SchoolSector
  yearLevel: YearLevel
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
}

export interface StudentModel extends BaseDocument {
  email: string
  password: string
  emailVerified?: Date
  applicationForm?: ApplicationFormProps
  applicationSubmission: string[]|RequirementSubmissionModel[]
  isGrantee: boolean
}

export interface AttendanceProps {
  studentId: string|StudentModel
}

export interface ExamProps {
  studentId: string|StudentModel
  percentageScore: number
}

export interface ScheduleModel extends BaseDocument {
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
}

export interface ResultModel extends BaseDocument {
  studentId: string|StudentModel
  scheduleId: string|ScheduleModel
  grade: number
  remarks: GradeRemarks
}

export type AuthenticationStatus = 'authenticated' | 'unauthenticated' | 'loading' | 'error'

export interface ActionResponseInterface {
  success?: string
  error?: string
}

export type ActionResponse = ActionResponseInterface | undefined