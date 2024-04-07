'use client'

import { useFormStatus } from 'react-dom'
import { Button, ButtonProps } from './ui/button'

interface SubmitButtonProps extends ButtonProps {
  label?: string
  labelPending?: string
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label = 'Submit',
  labelPending = 'Submitting...',
  ...restProps
}) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant="secondary" disabled={pending} {...restProps}>
      {pending ? labelPending : label}
    </Button>
  )
}

export default SubmitButton
