import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { deleteUserReading } from '@/actions/records'

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
      await deleteUserReading(recordId)
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
