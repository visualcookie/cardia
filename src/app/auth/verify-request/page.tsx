import { HeartPulseIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const VerifyRequestPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-row justify-center items-center gap-4">
          <HeartPulseIcon className="h-12 w-12 p-2 rounded-xl border bg-card text-card-foreground shadow text-black dark:text-white" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Cardia
          </h1>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <p>A sign in link has been sent to your email address.</p>
            <p>
              If the email did not arrive,{' '}
              <Link href="#">click here to send again</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default VerifyRequestPage
