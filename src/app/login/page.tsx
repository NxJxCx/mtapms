import { Metadata } from "next";
import LoginComponent from "./component";

export const metadata: Metadata = {
  title: 'Login'
}

export default function LoginPage() {
  return <LoginComponent />
}
