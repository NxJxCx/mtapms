import 'server-only';

import { hashPassword } from '@app/lib/hash';
import { ApplicationFormProps, CivilStatus, Gender, SchoolSector, StudentModel } from '@app/types';
import { model, models, Schema } from 'mongoose';

const ApplicationFormSchema = new Schema<ApplicationFormProps>({
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: [true, 'Schedule Id is required.']
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
  },
  firstName: {
    type: String,
    required: [true, 'First Name is required']
  },
  middleName: String,
  maidenName: String,
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of Birth is required']
  },
  placeOfBirth: {
    type: String,
    required: [true, 'Place of Birth is required']
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent Address is required']
  },
  zipCode: {
    type: String,
    required: [true, 'Zip Code is required']
  },
  province: {
    type: String,
    required: [true, 'Province is required']
  },
  presentAddress: {
    type: String,
    required: [true, 'Present Address is required']
  },
  sex: {
    type: String,
    enum: Gender,
    required: [true, 'Sex is required']
  },
  civilStatus: {
    type: String,
    enum: CivilStatus,
    required: [true, 'Civil Status is required']
  },
  citizenship: {
    type: String,
    required: [true, 'Citizenship is required']
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile Number is required'],
    match: /^(\+639|09|9)\d{9}$/
  },
  nameOfSchoolAttended: {
    type: String,
    required: [true, 'Name of School Attended is required']
  },
  schoolAddress: {
    type: String,
    required: [true, 'School Address is required']
  },
  schoolSector: {
    type: String,
    enum: SchoolSector,
    required: [true, 'School Sector is required']
  },
  yearLevel: {
    type: Number,
    required: [true, 'Year Level is required']
  },
  course: {
    type: String,
    required: [true, 'Course is required']
  },
  tribalMembership: String,
  typeOfDisability: String,
  fatherLiving: {
    type: Boolean,
    default: false,
  },
  fatherName: {
    type: String,
    default: ''
  },
  fatherAddress: {
    type: String,
    default: ''
  },
  fatherOccupation: {
    type: String,
    default: ''
  },
  motherLiving: {
    type: Boolean,
    default: false,
  },
  motherName: {
    type: String,
    default: ''
  },
  motherAddress: {
    type: String,
    default: ''
  },
  motherOccupation: {
    type: String,
    default: ''
  },
  totalParentGrossIncome: {
    type: Number,
    required: [true, 'Total Parent Gross Income is required']
  },
  siblings: {
    type: Number,
    required: [true, 'Number of Siblings is required']
  },
  otherEducationalFinancialAssistance: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
})

const StudentSchema = new Schema<StudentModel>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  emailVerified: {
    type: Date
  },
  applicationForm: {
    type: ApplicationFormSchema
  },
  applicationSubmission: {
    type: [{ type: Schema.Types.ObjectId, ref: 'RequirementSubmission', required: [true, 'Requirement Submission Id is required.'] }],
    default: []
  },
  isGrantee: {
    type: Boolean,
    default: false
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: 'FileDocument',
    default: null
  }
}, {
  timestamps: true
})

StudentSchema.pre('save', function (next: any) {
  const admin = this;
  if (this.isModified('password') || this.isNew) {
    hashPassword(admin.password, (hashErr, hash) => {
      if (hashErr) {
        return next(hashErr)
      }
      admin.password = hash
      next()
    })
  } else {
    return next()
  }
})


export default models?.Student || model<StudentModel>('Student', StudentSchema)
