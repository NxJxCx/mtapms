import { Metadata } from "next";
import LoginTabComponent from "./component";

export const metadata: Metadata = {
  title: 'Login'
}

export default function LoginPage() {
  return <LoginTabComponent />
}
