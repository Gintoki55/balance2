import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RO Calculator - Reverse Osmosis Desalination',
  description: 'Professional Reverse Osmosis (RO) calculator for desalination engineers. Unit converters and RO membrane element calculations.',
  keywords: 'RO calculator, reverse osmosis, desalination, water treatment, membrane, permeability',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
