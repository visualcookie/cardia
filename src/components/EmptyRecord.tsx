'use client'

import { useState } from 'react'
import { SquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddRecordCard } from './AddRecordCard'

export interface EmptyRecordProps {
  userId: string
}

export const EmptyRecord: React.FC<EmptyRecordProps> = ({ userId }) => {
  const [creating, setCreating] = useState<boolean>(false)

  return !creating ? (
    <div className="flex flex-row items-center justify-center p-4 shadow rounded-md border bg-card">
      <p className="text-muted-foreground">
        It seems like you don&apos;t have any recordings yet.
      </p>
      <Button variant="link" onClick={() => setCreating(true)}>
        <SquarePlus className="mr-2 h-4 w-4" />
        <span>Add record</span>
      </Button>
    </div>
  ) : (
    <AddRecordCard userId={userId} onCancel={() => setCreating(false)} />
  )
}
