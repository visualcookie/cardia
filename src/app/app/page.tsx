import { desc, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import ExportRecords from '@/components/ExportRecords'
import NewRecordDialog from '@/components/NewRecordDialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { db } from '@/db'
import { records, users } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { columns } from './columns'
import { DataTable } from './data-table'

const AppMainPage = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/signin')
  }

  // TODO: Move this to a middleware
  const shouldOnboard = await db.query.users.findFirst({
    where: eq(users.id, data.user.id),
  })

  if (!shouldOnboard?.username || !shouldOnboard?.profilePicture) {
    redirect('/app/welcome')
  }

  const dbRecords = await db.query.records.findMany({
    where: eq(records.userId, data.user.id),
    orderBy: desc(records.recordedAt),
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>Records</CardTitle>
          <CardDescription>Your blood pressure records.</CardDescription>
        </div>
        <div className="space-x-2">
          <NewRecordDialog />
          <ExportRecords userId={data.user.id} />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={dbRecords} />
      </CardContent>
    </Card>
  )
}

export default AppMainPage
