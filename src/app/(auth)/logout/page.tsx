'use client'
import { redirect, useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  router.refresh()
  return redirect('/')
}