import { auth } from '@/auth'
import SettingsForm from '@/components/settings-form'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

const NewUserPage = async () => {
  const session = await auth()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>👋 Welcome to Cardia</CardTitle>
          <CardDescription>
            To probably set you up, we need further informations about you.
            Don&apos;t worry, we won&apos;t sell your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* NOTE: can i reuse the settings form here? */}
          <SettingsForm user={session?.user} isNewUser />
        </CardContent>
      </Card>
    </div>
  )
}

export default NewUserPage
