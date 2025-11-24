import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Farcaster Risk Game',
  description: 'A turn-based Risk-like game on Farcaster',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
