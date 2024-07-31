import 'only-server';

import { hashPassword } from '@app/lib/hash';
import { AdminModel } from '@app/types';
import { model, models, Schema } from 'mongoose';


const AdminSchema = new Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required']
  },
  firstName: {
    type: String,
    required: [true, 'First Name is required']
  },
  middleName: String
}, {
  timestamps: true
})

AdminSchema.pre('save', function (next: any) {
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

export default models?.Admin || model<AdminModel>('Admin', AdminSchema)