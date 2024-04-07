import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SettingsPage = async () => {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* <OnboardingForm /> */}
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage
