'use client';
import Buttons from "@app/components/buttons";
import Inputs from "@app/components/inputs";
import Toaster from "@app/components/toaster";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { signupAction } from "@app/app/(auth)/_actions/auth";


export default function SignupComponent() {
  const router = useRouter()
  const [state, action] = useFormState(signupAction, {
    success: false,
  })

  useEffect(() => {
    if (state.success) {
      Toaster.success("Registered Successfully")
    }
  }, [state, router])

  return (
    <div className="mt-4 lg:m-0">
      <h1 className="text-[#FBBC05] font-[500] text-[30px] leading-[45px]">Sign Up</h1>
      <p className="text-[#004521] font-[400] text-[16px] leading-[24px] lg:mt-4">If you already have an account,</p>
      <p className="text-[#004521] font-[400] text-[16px] leading-[24px]">You can <Link href="/" className="text-[#FBBC05] font-[600]">Login here.</Link></p>
      <h2 className="text-[#468966] font-[900] leading-[22.5px] text-[15px] mt-3  lg:mt-6">ACCOUNT REGISTRATION</h2>
      <Inputs.SignupInput type="email" name="email" label="Email" iconSrc="/email.svg" placeholder="Enter your email address" className="mt-2" required />
      <Inputs.SignupInput name="firstName" label="First Name" iconSrc="/person.svg" placeholder="Enter Your First Name" className="mt-3" required />
      <Inputs.SignupInput name="middleName" label="Middle Name" iconSrc="/person.svg" placeholder="Enter Your Middle Name" className="mt-3" />
      <Inputs.SignupInput name="lastName" label="Last Name" iconSrc="/person.svg" placeholder="Enter Your Last Name" className="mt-3" required />
      <Inputs.SignupInput name="schoolId" label="School ID" iconSrc="/person.svg" placeholder="Enter Your School ID" className="mt-3" required />
      <Inputs.SignupInput type="password" name="password" label="Password" iconSrc="/padlock.svg" placeholder="Enter your Password" className="mt-3" required />
      <Inputs.SignupInput type="password" name="confirmPassword" label="Confirm Password" iconSrc="/padlock.svg" placeholder="Re-enter your Password" className="mt-3" required />
      <div className="mt-6 lg:mt-8 lg:mb-10">
        <Buttons.SignupButton label="Register" />
      </div>
    </div>
  )
}