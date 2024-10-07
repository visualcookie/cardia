import { auth } from '@/auth'
import SettingsForm from '@/components/settings-form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

const SettingsPage = async () => {
  const session = await auth()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Your settings</CardTitle>
          <CardDescription>
            Manage your account settings, customize your profile, and set
            communication preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm user={session?.user} />
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
