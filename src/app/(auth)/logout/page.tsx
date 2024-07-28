'use client'
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    router.refresh()
  }, [router])
  return redirect('/')
}