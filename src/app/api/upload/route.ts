import { NextRequest, NextResponse } from 'next/server'
import multer from 'multer'
import path from 'path'
import { writeFile } from 'fs/promises'

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
})

function runMiddleware(req: NextRequest, middleware: any) {
  return new Promise((resolve, reject) => {
    middleware(
      req,
      {
        end: (data: any) => {
          resolve(data)
        },
        setHeader: () => {},
        status: (code: number) => ({ end: (data: any) => reject(data) }),
      },
      (result: any) => {
        resolve(result)
      }
    )
  })
}

export async function POST(request: NextRequest) {
  try {
    await runMiddleware(request, upload.single('avatar'))

    const formData = await request.formData()
    const file = formData.get('avatar') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const filename = Date.now() + '-' + file.name.replaceAll(' ', '_')
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)

    await writeFile(filePath, Buffer.from(buffer))

    const fileUrl = `/uploads/${filename}`
    return NextResponse.json({ fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    if (error instanceof multer.MulterError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
