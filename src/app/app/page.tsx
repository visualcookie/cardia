import { desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { profile, records } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { RecordCard } from '@/components/RecordCard'
import { Toolbar } from '@/components/Toolbar'
import { EmptyRecord } from '@/components/EmptyRecord'

const AppMainPage = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/signin')
  }

  // Check if the user has a profile, if not redirect to onboarding page
  const hasUserProfile = await db.query.profile
    .findFirst({
      where: eq(profile.id, data.user.id),
    })
    .then((profile) => profile?.onboardingCompleted)

  if (!hasUserProfile) {
    redirect('/app/onboarding')
  }

  // Fetch all records for the current user
  const dbRecords = await db.query.records.findMany({
    where: eq(records.userId, data.user.id),
    orderBy: desc(records.recordedAt),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Blood Pressure Records</h1>
        <p className="text-sm text-muted-foreground">
          Here you can see all your blood pressure records.
        </p>
      </div>

      {dbRecords.length <= 0 && <EmptyRecord userId={data.user.id} />}

      {dbRecords.length > 0 && (
        <>
          <Toolbar userId={data.user.id} />

          {dbRecords.map(
            ({ id, systolic, diastolic, pulse, recordedAt }, index) => {
              return (
                <RecordCard
                  key={id}
                  {...{ id, systolic, diastolic, pulse, recordedAt }}
                />
              )
            }
          )}
        </>
      )}

      {/* TODO: Implement logic + hover for better visualisation */}
      {/* <button className="flex flex-row justify-center mt-4 border-t-4 border-primary">
        <div className="flex flex-col items-center justify-center w-8 h-8 -mt-[17px] rounded-full bg-primary text-white">
          <ChevronsUpDown className="h-4 w-4" />
          <span className="sr-only">View more records</span>
        </div>
      </button> */}
    </div>
  )
}

export default AppMainPage
