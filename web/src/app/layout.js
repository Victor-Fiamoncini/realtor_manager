import '@/app/globals.css'

import { Geist, Geist_Mono } from 'next/font/google'
import React from 'react'

import Providers from '@/app/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'Realtor Manager',
  description: 'Manage your real estate efficiently',
}

const RootLayout = ({ children }) => (
  <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers>{children}</Providers>
    </body>
  </html>
)

export default RootLayout
