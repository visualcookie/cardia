import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cardia - Bloodpressure Tracker',
  description:
    'Cardia is a bloodpressure tracker that helps you keep track of your bloodpressure over time. It is a simple and easy to use app that helps you keep track of your bloodpressure readings and helps you stay healthy.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`dark bg-background ${inter.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

