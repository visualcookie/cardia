import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from './onboarding-form'

const OnboardingPage = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Set up your profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Complete the following steps to create your account.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <OnboardingForm userId={data.user.id} />
      </div>
    </div>
  )
}

export default OnboardingPage
