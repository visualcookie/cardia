'use client'

import React, { useState } from 'react'
import { Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DeleteRecordDialog from './delete-record-dialog'

export interface RecordCardProps {
  id: string
  systolic: number
  diastolic: number
  pulse: number
  createdAt: Date | null
}

const Options: React.FC<{ onDelete: () => void; onEdit: () => void }> = ({
  onDelete,
  onEdit,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button>
        <Edit3 className="h-4 w-4" />
        <span className="sr-only">Open record actions menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onClick={onEdit}>
        <Edit3 className="mr-2 h-4 w-4" />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const RecordCard: React.FC<RecordCardProps> = ({
  id,
  systolic,
  diastolic,
  pulse,
  createdAt,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)
  const formattedDate = new Date(createdAt!).toLocaleDateString()
  const formattedTime = new Date(createdAt!).toLocaleTimeString()

  return (
    <>
      <div
        key={id}
        className="flex flex-row items-center justify-between p-4 shadow rounded-md border bg-card hover:border-primary transition-colors duration-200 ease-in-out"
      >
        <div className="flex flex-col text-muted-foreground min-w-24">
          <p className="font-bold text-primary">{formattedDate}</p>
          <p className="text-sm">{formattedTime}</p>
        </div>
        <div className="flex flex-col min-w-24">
          <p className="inline-flex items-center gap-2 font-bold text-3xl">
            {systolic}
          </p>
          <p className="text-muted-foreground">Systolic</p>
        </div>
        <div className="flex flex-col min-w-24">
          <p className="inline-flex items-center gap-2 font-bold text-3xl">
            {diastolic}
          </p>
          <p className="text-muted-foreground">Diastolic</p>
        </div>
        <div className="flex flex-col min-w-24">
          <p className="font-bold text-3xl">{pulse}</p>
          <p className="text-muted-foreground">Pulse</p>
        </div>
        <div className="flex flex-col">
          <Options
            onEdit={() => console.log('to be implemented')}
            onDelete={() => setDeleteDialog(true)}
          />
        </div>
      </div>

      <DeleteRecordDialog
        recordId={id}
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
      />
    </>
  )
}
