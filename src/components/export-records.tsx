'use client'

import { Button } from './ui/button'
import { toast } from './ui/use-toast'

const ExportRecords: React.FC<{ userId: string }> = ({ userId }) => {
  const handleExport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/records/export`,
      {
        method: 'POST',
        body: new FormData(event.currentTarget),
      }
    )

    if (response.status !== 200) {
      return toast({
        title: 'Export failed',
        description: 'An error occurred while exporting your records.',
      })
    }

    toast({
      title: 'Export successful',
      description: 'Your download should start shortly.',
    })

    response.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `records-${Date.now()}.xlsx`
      a.click()
    })
  }

  return (
    <form onSubmit={handleExport} className="inline-flex">
      <input type="hidden" readOnly name="userId" value={userId} />
      <Button type="submit">Export records</Button>
    </form>
  )
}

export default ExportRecords
