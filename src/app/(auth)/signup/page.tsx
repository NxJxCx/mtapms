import { Metadata } from "next";
import SignupComponent from "./component";

export const metadata: Metadata = {
  title: 'Sign Up'
}

export default function SignupPage() {
  return <SignupComponent />
}
