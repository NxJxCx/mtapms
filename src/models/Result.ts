import 'server-only';

import { GradeRemarks, ResultModel } from '@app/types';
import { model, models, Schema } from 'mongoose';


const ResultSchema = new Schema<ResultModel>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student Id for result is required.'],
  },
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: [true, 'Schedule Id is required.'],
  },
  grade: {
    type: Number,
    min: 0,
    max: 100,
    required: [true, 'Grade is required'],
  },
  remarks: {
    type: String,
    enum: GradeRemarks,
    required: [true, 'Remarks are required'],
  }
}, {
  timestamps: true
})

ResultSchema.index({ studentId: 1, scheduleId: 1 }, { unique: true })

export default models?.Result || model<ResultModel>('Result', ResultSchema)
