import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Asoiu',
  description: 'Created by Ali Agasiyev',
  generator: 'Ali Agasiyev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
