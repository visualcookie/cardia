import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OnboardingForm from './onboarding-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const WelcomePage = async () => {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Set up your profile</CardTitle>
          <CardDescription>
            {`Welcome! Let's set up your profile so you can start using the app.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default WelcomePage
