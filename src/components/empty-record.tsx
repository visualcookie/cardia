'use client'

import { useState } from 'react'
import { SquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddRecordCard } from './add-record-card'

export const EmptyRecord: React.FC<{ userId: string }> = ({ userId }) => {
  const [creating, setCreating] = useState<boolean>(false)

  return !creating ? (
    <div className="flex flex-row items-center justify-center gap-4 p-4 shadow rounded-md border bg-card">
      <p className="text-muted-foreground">
        You haven&apos;t recorded any blood pressure readings yet. Start
        tracking your cardiovascular health today!
      </p>
      <Button onClick={() => setCreating(true)}>
        <SquarePlus className="mr-2 h-4 w-4" />
        <span>Add record</span>
      </Button>
    </div>
  ) : (
    <AddRecordCard userId={userId} onCancel={() => setCreating(false)} />
  )
}
