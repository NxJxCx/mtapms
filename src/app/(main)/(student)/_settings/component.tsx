'use client'

export default function AccountSettingsComponent() {
  return (<>
    <div className="p-6">
      <div className="text-4xl uppercase py-4 border-b-4 border-black text-black font-[700] mb-4">
        PROFILE INFORMATION
      </div>
      {/* Account Settings - change password */}
      <div className="w-[600px]">
        <div className="bg-[#FECB00] rounded-t-lg h-[103px] w-full"></div>
        <div className="relative bg-white">
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="current-password">
                Current Password
              </label>
              <input className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" type="password" id="current-password" name="current-password" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="new-password">
                New Password
              </label>
              <input className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" type="password" id="new-password" name="new-password" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm" type="password" id="confirm-password" name="confirm-password" required />
            </div>
          </form>
        </div>
      </div>
    </div>
  </>)
}