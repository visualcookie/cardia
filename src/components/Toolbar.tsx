'use client'

import { useState } from 'react'
import { Filter, SquarePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddRecordCard } from './AddRecordCard'

export const Toolbar: React.FC<{ userId: string }> = ({ userId }) => {
  const [addRecord, setAddRecord] = useState<boolean>(false)

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </Button>
          {/* <DatePickerWithRange /> */}
        </div>
        <Button disabled={addRecord} onClick={() => setAddRecord(true)}>
          <SquarePlus className="mr-2 h-4 w-4" />
          <span>Add record</span>
        </Button>
      </div>

      {addRecord && (
        <AddRecordCard {...{ userId }} onCancel={() => setAddRecord(false)} />
      )}
    </>
  )
}
