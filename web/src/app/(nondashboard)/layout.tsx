'use client'

import React, { PropsWithChildren } from 'react'

import AppNavbar from '@/components/app-navbar'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api'

const LandingLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: user } = useGetAuthUserQuery()

  return (
    <div className="h-full">
      <AppNavbar />

      <main className="flex h-full w-full flex-col" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        {children}
      </main>
    </div>
  )
}

export default LandingLayout
