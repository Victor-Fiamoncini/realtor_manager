'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { PropsWithChildren, useEffect, useState } from 'react'

import AppNavbar from '@/components/app-navbar'
import AppSidebar from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api'

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [isRedirectLoading, setIsRedirectLoading] = useState(true)

  const { data: user, isLoading: isAuthLoading } = useGetAuthUserQuery()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) return

    const userRole = user.userRole?.toLowerCase()

    if (
      (userRole === 'manager' && pathname.includes('/tenants')) ||
      (userRole === 'tenant' && pathname.includes('/managers'))
    ) {
      router.push(userRole === 'manager' ? '/managers/properties' : '/tenants/favorites', { scroll: false })

      return
    }

    setIsRedirectLoading(false)
  }, [pathname, router, user])

  if (isAuthLoading || isRedirectLoading) return 'Loading...'

  if (!user?.userRole) return null

  return (
    <SidebarProvider>
      <div className="bg-secondary min-h-screen w-full">
        <AppNavbar />

        <div style={{ marginTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <AppSidebar userType={user.userRole.toLowerCase()} />

            <div className="grow transition-all duration-300">{children}</div>
          </main>
        </div>
      </div>

      <Toaster />
    </SidebarProvider>
  )
}

export default DashboardLayout
