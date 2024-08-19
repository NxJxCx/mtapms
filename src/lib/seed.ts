import Admin from '@app/models/Admin';
import File from '@app/models/FileDocument';
import Grantee from '@app/models/Grantee';
import Requirement from '@app/models/Requirement';
import RequirementSubmission from '@app/models/RequirementSubmission';
import Result from '@app/models/Result';
import Schedule from '@app/models/Schedule';
import Student from '@app/models/Student';
import 'server-only';
import mongodbConnect from './db';

export default async function seed() {
  await mongodbConnect();
  // Seed Admin account
  const admin = await Admin.findOne({
    employeeId: '123'
  }).exec();
  if (!admin) {
    try {
      const newAdmin = await Admin.create({
        employeeId: '123',
        password: 'password',
        firstName: 'Erika Shane',
        middleName: '',
        lastName: 'Labor'
      });
    } catch (e) {
      console.log("admin error:", e)
    }
  }

  // Seed Student applicant account
  const applicant = await Student.findOne({
    email: 'applicant_test@gmail.com'
  }).exec();
  if (!applicant) {
    try {
      const newStudent = await Student.create({
        email: 'applicant_test@gmail.com',
        password: 'password',
        emailVerified: new Date(),
      });
    } catch (e) {
      console.log("student error:", e)
    }
  }
  // Seed Student grantee account
  const grantee = await Student.findOne({
    email: 'grantee_test@gmail.com'
  }).exec();
  if (!grantee) {
    try {
      const newStudent = await Student.create({
        email: 'grantee_test@gmail.com',
        password: 'password',
        emailVerified: new Date(),
        isGrantee: true
      });
    } catch (e) {
      console.log("grantee error:", e)
    }
  }
  await Grantee.find({});
  await Schedule.find({});
  await Requirement.find({});
  await RequirementSubmission.find({});
  await Result.find({});
  await File.find({});
}