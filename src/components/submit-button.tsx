'use client'

import { LoaderCircle } from 'lucide-react'
import { Button, ButtonProps } from './ui/button'

interface SubmitButtonProps extends ButtonProps {
  label?: string
  pending?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label = 'Submit',
  pending = false,
  ...restProps
}) => {
  return (
    <Button type="submit" variant="default" disabled={pending} {...restProps}>
      {pending && <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />}
      {label}
    </Button>
  )
}

export default SubmitButton

