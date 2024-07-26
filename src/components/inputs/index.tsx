'use client'

import { HTMLInputTypeAttribute } from "react";

function AuthInput({
  name,
  label,
  type = 'text',
  placeholder,
}: Readonly<{
  name?: string;
  label?: string;
  type?: HTMLInputTypeAttribute,
  placeholder?: string;
}>) {
  return (
    <div>
      {!!label && <label htmlFor={name} className="text-[#00823E] text-[22px] font-[600] leading-[26.82px] mb-2">{label}</label> }
      <input type={type} id={name} name={name} placeholder={placeholder} title={label} className="mt-1 h-[57px] w-full rounded-[12px] border-[2px] border-[#0F8346] outline-green-500 text-[#468966B2] px-4 font-[500] text-[20px] leading-[24.38px]" />
    </div>
  )
}

const Inputs = {
  AuthInput
}

export default Inputs