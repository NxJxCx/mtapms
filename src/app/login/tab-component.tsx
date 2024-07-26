'use client';
import Buttons from "@app/components/buttons";
import Inputs from "@app/components/inputs";
import Tabs, { type TabNavTabsProp } from "@app/components/tabs";
import Toaster from "@app/components/toaster";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";

export default function LoginTabComponent() {
  const router = useRouter()
  const tabs = useMemo<TabNavTabsProp[]>(() => [
    { label: 'Student', key: 'student' },
    { label: 'Admin', key: 'admin' }
  ], [])
  const [selected, setSelected] = useState<string|undefined>(tabs?.[0]?.key)

  const [state, action] = useFormState<Promise<{success: boolean}>, {}>(async function(prevState: {success: boolean}, formData: {}) {
    console.log(prevState, formData)
    await new Promise((res) => setTimeout(res, 2000))
    return {
      success: true
    }
  }, {
    success: false
  })

  useEffect(() => {
    if (state.success) {
      // router.push('/')
      Toaster.success("SUCCESS! asd sadsad asdsad sad asd sad sadasd sad asd asd asdasd sad asd sadsasda")
    }
  }, [state, router])

  return (
    <Tabs.AuthTabNav
      tabs={tabs}
      defaultSelectedTab={"admin"}
      selectedTab={selected}
      onSelectedTab={setSelected}
    >
      {tabs.map(({label, key}) => (
        <Tabs.AuthTabContent key={key} name={key}>
          <div className="p-12">
            <h1 className="text-[#0F8346] text-[28px] uppercase font-[800] leading-[34.13px] text-center mb-1">LOG IN YOUR ACCOUNT</h1>
            <p className="text-[#0F8346] text-[16px] font-[400] leading-[19.5px] mb-6 text-center">Effortlessly request documents online</p>
            <p className="text-[#0F8346] text-[20px] font-[700] leading-[19.5px] mb-4 text-center">{label} Access</p>
            <form action={action} className="flex flex-col gap-y-8 flex-nowrap h-full">
              <Inputs.AuthInput name="email" label="Email" />
              <Inputs.AuthInput type="password" name="password" label="Password" />
              <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-y-0 sm:gap-x-6">
                <Buttons.AuthButton type="submit" label="Login" />
                <Buttons.AuthButton label="Sign Up" onClick={() => router.push('/signup')} />
              </div>
            </form>
          </div>
        </Tabs.AuthTabContent>
      ))}
    </Tabs.AuthTabNav>
  )
}