'use client'

import React, { PropsWithChildren } from 'react'

import AppNavbar from '@/components/app-navbar'
import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api'

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { data: user } = useGetAuthUserQuery()

  if (!user?.userRole) return null

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <AppNavbar />

        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <AppSidebar userType={user.userRole.toLowerCase()} />

            <div className="flex-grow transition-all duration-300">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout
