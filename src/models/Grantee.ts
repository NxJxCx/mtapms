import 'only-server';

import { GranteeModel, Semester, SubmissionStatus } from '@app/types';
import { model, models, Schema } from 'mongoose';


const GranteeSchema = new Schema<GranteeModel>({
  studentId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Student ID is required'],
  },
  academicYear: {
    type: Number,
    minLength: 2020,
    maxLength: 2050,
    required: [true, 'Academic Year is required'],
  },
  semester: {
    type: Number,
    enum: Semester,
    required: [true, 'Semester is required'],
  },
  COG: {
    photo: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    status: {
      type: String,
      enum: SubmissionStatus,
      default: SubmissionStatus.Pending,
    }
  },
  studyLoad: {
    photo: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    status: {
      type: String,
      enum: SubmissionStatus,
      default: SubmissionStatus.Pending,
    }
  },
  statementOfAccount: {
    photo: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    status: {
      type: String,
      enum: SubmissionStatus,
      default: SubmissionStatus.Pending,
    }
  },
  CONS: {
    photo: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    status: {
      type: String,
      enum: SubmissionStatus,
      default: SubmissionStatus.Pending,
    }
  },
}, {
  timestamps: true
})

GranteeSchema.index({ studentId: 1, academicYear: 1, semester: 1 }, { unique: true })

export default models?.Grantee || model<GranteeModel>('Grantee', GranteeSchema)
