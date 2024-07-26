'use client';

import { useMemo } from "react";
import { useFormStatus } from "react-dom";
import AnimatedIcons from "../icons/animated";

function AuthButton({
  type = 'button',
  label = '',
  isLoading = false,
  onClick,
  ...props
}: Readonly<{
  type?: "button" | "submit" | "reset";
  label: string | React.ReactNode;
  isLoading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}>) {
  const { pending } = useFormStatus()
  const loading = useMemo(() => type === 'submit' ? pending : isLoading, [pending, type, isLoading])
  return <button type={type} onClick={onClick} className="disabled:bg-gray-200 disabled:text-gray-300 bg-[#0F8346] hover:bg-green-600 text-white h-[67px] leading-[29.26px] text-[24px] font-[700] p-4 rounded-2xl" disabled={loading} {...props}>{!loading ? label : <AnimatedIcons.Spinner className="w-full flex justify-center items-center" />}</button>
}

const Buttons = {
  AuthButton
}

export default Buttons
