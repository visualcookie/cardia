import { db } from '@/db'
import { records } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import * as XLSX from 'sheet.js'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const userId = formData.get('userId') as string

  if (!userId) {
    return Response.json(
      {
        title: 'Export failed',
        message: 'User ID is required.',
      },
      { status: 400 }
    )
  }

  try {
    const dbRecords = await db.query.records.findMany({
      where: eq(records.userId, userId),
    })

    if (dbRecords.length === 0) {
      return Response.json(
        {
          title: 'Export failed',
          message: 'We could not find any records to export.',
        },
        { status: 400 }
      )
    }

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dbRecords)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Records')
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.ms-excel',
        'Content-Disposition': `attachment; filename=records.xlsx`,
      },
    })
  } catch (error) {
    console.error(error)
    return Response.json(
      {
        title: 'Export failed',
        message: 'Could not export records. Please try again.',
      },
      { status: 500 }
    )
  }
}
