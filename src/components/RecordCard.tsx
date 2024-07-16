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
import DeleteRecordDialog from './DeleteRecordDialog'
import Badge from './Badge'

export interface RecordCardProps {
  id: string
  systolic: number
  diastolic: number
  pulse: number
  recordedAt: Date
}

const Options: React.FC<{ onDelete: () => void }> = ({ onDelete }) => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button>
        <Edit3 className="h-4 w-4" />
        <span className="sr-only">Open record actions menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
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
  recordedAt,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false)

  const getSystolicStatus = (systolic: number) => {
    switch (true) {
      case systolic > 120:
        return 'Elevated'
      case systolic < 140:
        return 'Stage 1'
      case systolic < 160:
        return 'Stage 2'
      case systolic < 180:
        return 'Stage 3'
      default:
        return false
    }
  }

  const getDiastolicStatus = (diastolic: number) => {
    switch (true) {
      case diastolic < 85:
        return 'High'
      case diastolic < 90:
        return 'Stage 1'
      case diastolic < 100:
        return 'Stage 2'
      case diastolic < 110:
        return 'Stage 3'
      default:
        return false
    }
  }

  const formattedDate = new Date(recordedAt).toLocaleDateString()
  const formattedTime = new Date(recordedAt).toLocaleTimeString()
  const systolicStatus = getSystolicStatus(systolic)
  const diastolicStatus = getDiastolicStatus(systolic)

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
            {systolicStatus && (
              <Badge
                color={systolicStatus === 'Elevated' ? 'warning' : 'danger'}
              >
                {systolicStatus}
              </Badge>
            )}
          </p>
          <p className="text-muted-foreground">Systolic</p>
        </div>
        <div className="flex flex-col min-w-24">
          <p className="inline-flex items-center gap-2 font-bold text-3xl">
            {diastolic}
            {diastolicStatus && (
              <Badge color={diastolicStatus === 'High' ? 'warning' : 'danger'}>
                {diastolicStatus}
              </Badge>
            )}
          </p>
          <p className="text-muted-foreground">Diastolic</p>
        </div>
        <div className="flex flex-col min-w-24">
          <p className="font-bold text-3xl">{pulse}</p>
          <p className="text-muted-foreground">Pulse</p>
        </div>
        <div className="flex flex-col">
          <Options onDelete={() => setDeleteDialog(true)} />
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
