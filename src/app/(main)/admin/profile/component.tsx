'use client';;
import { displayFullName } from "@app/components/display";
import { LoadingSpinnerFull } from "@app/components/loadings";
import Toaster from "@app/components/toaster";
import { useSession } from "@app/lib/useSession";
import { AdminModel } from "@app/types";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { Roboto } from "next/font/google";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { uploadPhoto } from "./action";

const roboto = Roboto({ weight: ["500", "700"], subsets: ["latin", "latin-ext"] });

export default function ProfilePage() {

  const { data: sessionData } = useSession({
    redirect: false
  });
  const [photo, setPhoto] = useState<File>();
  const [user, setUser] = useState<AdminModel>(sessionData?.user);

  const photoURL = useMemo(() => !!user ? (new URL('/api/user/photo/' + (user.photo || 'default'), window.location.origin)).toString() : (new URL('/api/user/photo/default', window.location.origin)).toString(), [user])

  const getUserData = useCallback(() => {
    if (!!sessionData?.user?._id) {
      const url = new URL('/api/scholarship/applications/profile/' + (sessionData?.user?._id), window.location.origin);
      fetch(url)
        .then(res => res.json())
        .then(({ data }) => setUser(data))
        .catch((e) => console.log(e))
    }
  }, [sessionData?.user?._id])

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const upRef = useRef(null)
  const formRef = useRef<HTMLButtonElement>(null)

  const onUpdatePhoto = useCallback(() => {
    (upRef.current as any)?.click();
  }, [])

  const onChangePhoto = useCallback((e: any) => {
    setPhoto(e.target.files?.[0]);
    setTimeout(() => formRef.current?.click(), 500);
  }, [formRef])

  const onUpload = useCallback(async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (!photo) {
      Toaster.error('Please select a photo');
      return;
    }
    const formData = new FormData();
    formData.append('photo', photo, photo.name);
    const { success, error } = await uploadPhoto(formData)
    if (error) {
      Toaster.error(error);
    } else if (success) {
      Toaster.success(success);
      setTimeout(() => getUserData(), 100);
    }
  }, [photo])

  return (
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        SCHOLAR PROFILE INFORMATION
      </div>
      {/* Profile information */}
      <div className="w-[600px]">
        <div className="bg-[#FECB00] rounded-t-lg h-[103px] w-full"></div>
        <div className="relative bg-white">
          {!user?.firstName ? <LoadingSpinnerFull /> : (<>
            <div className="absolute left-6 -top-[17%] flex gap-x-6">
              <button type="button" onClick={onUpdatePhoto} className="p-1 rounded-full aspect-square w-32 flex justify-center items-center bg-white border shadow even:*:hidden even:*:hover:block" title="upload">
                <img src={photoURL} width={200} height={200} alt="Photo" className="rounded-full aspect-square object-contain" />
                <ArrowTopRightOnSquareIcon className="absolute w-6 h-6 left-[32%] top-[82%] hover:text-[#606060] text-[#818181]" />
              </button>
              <form method="post" onSubmit={onUpload}>
                <input ref={upRef} type="file" id="photo" name="photo" accept="image/*" onChange={onChangePhoto} hidden />
                <button ref={formRef} type="submit" className="hidden" title="submit" />
              </form>
              <div className="pt-16 text-[#1D1D1D]">
                <h1 className="font-[700] uppercase pt-2">
                  {displayFullName(user as any, true)}
                </h1>
                <h4 className="text-xs font-[600]">
                  {user?.employeeId}
                </h4>
              </div>
            </div>
            <div className="pt-20 px-8 pb-8">
              <div className="flex items-center mb-2">
                <div className="text-[#606060] font-[700] leading-[47.5px] min-w-36 pr-2">
                  Employee ID
                </div>
                <div className={clsx(roboto.className, "text-[#1D1D1D] uppercase w-full px-4 py-1 border border-[#818181] bg-[#D1D1D1] rounded-lg text-[15px]")}>
                  {user?.employeeId}
                </div>
              </div>
              <div className="flex items-center mb-2">
                <div className="text-[#606060] font-[700] leading-[47.5px] min-w-36 pr-2">
                  Full Name
                </div>
                <div className={clsx(roboto.className, "text-[#1D1D1D] uppercase w-full px-4 py-1 border border-[#818181] bg-[#D1D1D1] rounded-lg text-[15px]")}>
                  {displayFullName(user as any, true)}
                </div>
              </div>
            </div>
          </>)}
        </div>
      </div>
    </div>
  )
}