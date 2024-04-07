'use client'

import DeleteRecordDialog from '@/components/DeleteRecordDialog'
import { ColumnDef } from '@tanstack/react-table'

export type Records = {
  id: string
  recordedAt: Date
  systolic: number
  diastolic: number
  pulse: number
  userId: string
}

export const columns: ColumnDef<Records>[] = [
  {
    header: 'Date of record',
    accessorKey: 'recordedAt',
    enableSorting: true,
    cell: ({ row }) => {
      const recordedAt = row.getValue('recordedAt') as string
      const formatted = new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(new Date(recordedAt))

      return formatted
    },
  },
  {
    header: 'SYS',
    accessorKey: 'systolic',
    size: 40,
  },
  {
    header: 'DIA',
    accessorKey: 'diastolic',
    size: 40,
  },
  {
    header: 'Pulse',
    accessorKey: 'pulse',
    size: 40,
  },
  {
    id: 'actions',
    size: 80,
    cell: ({ row }) => {
      const record = row.original
      return (
        <div className="flex flex-row justify-end space-x-2">
          <DeleteRecordDialog recordId={record.id} />
        </div>
      )
    },
  },
]
