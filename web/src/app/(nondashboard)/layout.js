'use client'

import React, { useEffect } from 'react'

import AppNavbar from '@/components/app-navbar'
import { NAVBAR_HEIGHT } from '@/lib/constants'

const LandingLayout = ({ children }) => (
  <div className="h-full">
    <AppNavbar />

    <main className="flex h-full w-full flex-col" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
      {children}
    </main>
  </div>
)

export default LandingLayout
