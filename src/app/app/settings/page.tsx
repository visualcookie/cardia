import { ProfileForm } from './profile-form'
import { db } from '@/db'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { SettingsNavigation } from './navigation'
import { profile } from '@/db/schema'

const SettingsPage = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/signin')
  }

  const profileData = await db.query.profile.findFirst({
    where: eq(profile.id, data.user?.id),
  })

  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="-mx-4 lg:w-60">
        <SettingsNavigation />
      </aside>
      <div className="flex-1 lg:max-w-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Profile</h3>
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          className="shrink-0 bg-border h-[1px] w-full mb-4"
        ></div>
        <ProfileForm
          {...{
            profileData,
            userId: data.user.id ?? '',
            email: data.user.email ?? '',
          }}
        />
      </div>
    </div>
  )
}

export default SettingsPage
