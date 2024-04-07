'use client'

import { toast } from './ui/use-toast'
import { Button } from './ui/button'

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

    let data

    if (response.status !== 200) {
      data = await response.json()
    }

    if (response.status === 400 || response.status === 500) {
      toast({
        title: data.title,
        description: data.message,
      })
      return
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
