import { auth } from '@/auth'
import { getAllReadingsByUser } from '@/lib/db/queries'
import { EmptyRecord } from '@/components/empty-record'
import { RecordCard } from '@/components/record-card'
import { Toolbar } from '@/components/toolbar'

const AppMainPage = async () => {
  const session = await auth()
  const readings = await getAllReadingsByUser(session?.user?.id!)

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Blood Pressure Records</h1>
        <p className="text-sm text-muted-foreground">
          Track and manage your blood pressure readings over time. Add new
          records, view your history, and monitor your cardiovascular health.
        </p>
      </div>

      {readings.length <= 0 && <EmptyRecord userId={session?.user?.id!} />}
      {readings.length > 0 && <Toolbar userId={session?.user?.id!} />}
      {readings.map(({ id, systolic, diastolic, pulse, createdAt }) => (
        <RecordCard
          key={id}
          {...{ id, systolic, diastolic, pulse, createdAt }}
        />
      ))}
    </div>
  )
}

export default AppMainPage
