import { eq } from 'drizzle-orm'
import { Workbook } from 'exceljs'
import { db } from '@/db'
import { records } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'

enum StatusCodes {
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_REQUEST = 'BAD_REQUEST',
  EXPORT_FAILED = 'EXPORT_FAILED',
  EXPORT_SUCCESS = 'EXPORT_SUCCESS',
}

export async function POST(req: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) {
    return Response.json(StatusCodes.UNAUTHORIZED, {
      status: 401,
    })
  }

  const dbRecords = await db.query.records.findMany({
    where: eq(records.userId, user.id),
  })

  if (dbRecords.length === 0) {
    return Response.json(StatusCodes.EXPORT_FAILED, {
      status: 400,
    })
  }

  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet(`Records`)
  worksheet.columns = [
    { header: 'Recorded at', key: 'recordedAt', width: 20 },
    { header: 'Systolic', key: 'systolic', width: 10 },
    { header: 'Diastolic', key: 'diastolic', width: 10 },
    { header: 'Pulse', key: 'pulse', width: 10 },
  ]

  dbRecords.forEach((record) => {
    worksheet.addRow(record)
  })

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true }
  })

  const buffer = await workbook.xlsx.writeBuffer()

  if (buffer.byteLength === 0) {
    return Response.json(StatusCodes.EXPORT_FAILED, {
      status: 500,
    })
  }

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.ms-excel',
      'Content-Disposition': `attachment; filename=records.xlsx`,
    },
  })
}
