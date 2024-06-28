import { Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { deleteRecord } from '@/actions/records'

export interface DeleteRecordDialogProps {
  recordId: string
  isOpen: boolean
  onClose: () => void
}

const DeleteRecordDialog: React.FC<DeleteRecordDialogProps> = ({
  recordId,
  isOpen,
  onClose,
}) => {
  const handleDelete = async () => {
    try {
      await deleteRecord(recordId)
      onClose()
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete that record?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            record without recovery.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteRecordDialog
