import 'only-server';

import { AttendanceProps, ScheduleModel } from '@app/types';
import { model, models, Schema } from 'mongoose';

const AttendanceSchema = new Schema<AttendanceProps>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student Id for attendance is required.'],
  }
}, {
  timestamps: true
})

const ScheduleSchema = new Schema<ScheduleModel>({
  academicYear: {
    type: Number,
    minLength: 2020,
    maxLength: 2050,
    required: [true, 'Academic Year is required.'],
    unique: true
  },
  range: {
    startDate: {
      type: Date,
      required: [true, 'Start Date is required.'],
    },
    endDate: {
      type: Date,
      required: [true, 'End Date is required.'],
    },
  },
  orientationDate: Date,
  examDate: Date,
  interviewDate: Date,
  orientationAttendance: {
    type: [AttendanceSchema],
    default: [],
  },
  examScores: {
    type: [{
      studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student Id is required.'],
      },
      percentageScore: {
        type: Number,
        min: 0,
        max: 100,
        required: [true, 'Percentage Score is required.'],
      }
    }],
    default: []
  }
}, {
  timestamps: true
})

export default models?.Schedule || model<ScheduleModel>('Schedule', ScheduleSchema)
