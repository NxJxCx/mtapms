'use server'

import mongodbConnect from "@app/lib/db";
import { compare } from "@app/lib/hash";
import { createSession } from "@app/lib/session";
import Admin from "@app/models/Admin";
import Student from "@app/models/Student";
import { Roles, StudentModel } from "@app/types";

export interface ResponseAction {
  success?: boolean;
  error?: {
    [key: string]: string;
  }
}

async function adminLogin(employeeId?: string, password?: string): Promise<ResponseAction> {
  await mongodbConnect();
  if (!employeeId ||!password) {
    return {
      success: false,
      error: {
        login: 'All fields are required'
      }
    }
  }
  const admin = await Admin.findOne({ employeeId }).select('password').lean().exec() as StudentModel;
  if (admin && (await compare(password, admin.password))) {
    const success = await createSession(Roles.Admin, admin._id!);
    let error = !success ? undefined : { login: 'Session failed. Please try again later or refresh page.' };
    return {
      success,
      error
    }
  }
  return {
    success: false,
    error: {
      login: 'Invalid Credentials'
    }
  }
}

async function studentLogin(email?: string, password?: string): Promise<ResponseAction> {
  await mongodbConnect();
  if (!email ||!password) {
    return {
      success: false,
      error: {
        login: 'All fields are required'
      }
    }
  }
  const student = await Student.findOne({ email }).select('password isGrantee').exec();
  if (student && (await compare(password, student.password))) {
    // create session
    const role = student.isGrantee ? Roles.Grantee : Roles.Applicant;
    const success = await createSession(role, student._id);
    let error = !success ? undefined : { login: 'Session failed. Please try again later or refresh page.' };
    return {
      success,
      error
    }
  }
  return {
    success: false,
    error: {
      login: 'Invalid Credentials'
    }
  }
}

export async function loginAction(prevState: ResponseAction, formData: FormData): Promise<ResponseAction> {
  if (prevState?.success) {
    return {
      success: false,
      error: {
        login: 'Previous login attempt failed. Please try again later or refresh page.'
      }
    }
  }

  const { loginas, email, employeeId, password } = Object.fromEntries(formData.entries());
  switch (loginas) {
    case 'admin': {
      return await adminLogin(employeeId as string|undefined, password as string|undefined);
    }
    case'student': {
      return await studentLogin(email as string|undefined, password as string|undefined);
    }
    default: {
      return {
        success: false,
        error: {
          login: 'Invalid login type'
        }
      }
    }
  }
}


export async function signupAction(prevState: ResponseAction, formData: any): Promise<ResponseAction> {
  if (prevState?.success) {
    return {
      success: false,
      error: {
        signup: 'Previous sign up attempt failed. Please try again later or refresh page.'
      }
    }
  }
  const { email, firstName, middleName, lastName, schoolId, password, confirmPassword } = Object.fromEntries(formData.entries());

  await new Promise((res) => setTimeout(res, 1000));

  if (password >= 8 && password === confirmPassword) {
    return {
      success: true
    }
  } else if (password < 8) {
    return {
      success: false,
      error: {
        password: 'Password should be at least 8 characters long'
      }
    }
  } else if (password!== confirmPassword) {
    return {
      success: false,
      error: {
        confirmPassword: 'Password should be at least 8 characters long'
      }
    }
  }

  return {
    success: false,
    error: {
      signup: 'Failed to Sign Up. Please try again.'
    }
  }
}