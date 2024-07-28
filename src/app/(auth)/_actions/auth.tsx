'use server'

export interface ResponseAction {
  success?: boolean;
  error?: {
    [key: string]: string;
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

  const { loginas, email, password } = Object.fromEntries(formData.entries());

  await new Promise((res) => setTimeout(res, 1000));

  if (
    (loginas === 'admin' && email === 'admin@example.com' && password === 'password123')
    || (loginas === 'student' && email === 'student@example.com' && password === 'password123')
  ) {
    return {
      success: true
    }
  }

  return {
    success: false,
    error: {
      login: 'Invalid credentials'
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