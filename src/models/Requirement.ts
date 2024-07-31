import 'only-server';

import { RequirementModel } from '@app/types';
import { model, models, Schema } from 'mongoose';


const RequirementSchema = new Schema({
  academicYear: {
    type: Number,
    minLength: 2020,
    maxLength: 2050,
    required: [true, 'Academic Year is required.'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'name for the first year requirement is required.'],
  },
  description: String,
  forFirstYearOnly: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
})

export default models?.Requirement || model<RequirementModel>('Requirement', RequirementSchema)
