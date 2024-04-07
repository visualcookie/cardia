'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import NewRecordForm from './NewRecordForm'

const formSchema = z.object({
  systolic: z.string().min(0),
  diastolic: z.string().min(0),
  pulse: z.string().min(0),
})

export type NewRecordFields = z.infer<typeof formSchema>

const NewRecordDialog: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add new record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new record</DialogTitle>
          <DialogDescription>
            {`Add a new record to your blood pressure history.`}
          </DialogDescription>
        </DialogHeader>
        <NewRecordForm closeDialog={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default NewRecordDialog
