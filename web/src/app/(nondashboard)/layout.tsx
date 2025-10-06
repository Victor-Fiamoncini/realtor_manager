'use client'

import { usePathname, useRouter } from 'next/navigation'
import React, { PropsWithChildren, useEffect, useState } from 'react'

import AppNavbar from '@/components/app-navbar'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api'

const LandingLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [isRedirectLoading, setIsRedirectLoading] = useState(true)

  const { data: user, isLoading: isAuthLoading } = useGetAuthUserQuery()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) return

    const userRole = user.userRole?.toLowerCase()

    if (userRole === 'manager' && (pathname.includes('/search') || pathname === '/')) {
      router.push('/managers/properties', { scroll: false })

      return
    }

    setIsRedirectLoading(false)
  }, [pathname, router, user])

  if (isAuthLoading || isRedirectLoading) return 'Loading...'

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
