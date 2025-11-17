'use client'

import { signOut } from 'aws-amplify/auth'
import { Plus, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api'

const AppNavbar = () => {
  const { data: user } = useGetAuthUserQuery()

  const router = useRouter()
  const pathname = usePathname()

  const isMobile = useIsMobile()

  const handleSignOut = async () => {
    await signOut()

    window.location.href = '/'
  }

  const userRole = user?.userRole?.toLowerCase() || null
  const isDashboardPage = pathname.includes('/managers') || pathname.includes('/tenants')

  return (
    <header className="fixed top-0 left-0 z-50 block w-full shadow-xl" style={{ height: `${NAVBAR_HEIGHT}px` }}>
      <div className="bg-primary flex h-full w-full items-center justify-between px-8 py-3 text-white">
        {isDashboardPage && (
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        )}

        <div className="flex items-center gap-6">
          <Link className="flex cursor-pointer items-center gap-4 text-xl font-bold" href="/" scroll={false}>
            <Image src="/logo.png" alt="Realtor Manager Logo" width={40} height={40} />
            {isMobile ? 'RM' : 'Realtor Manager'}
          </Link>
        </div>

        {user && userRole ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2">
              <Avatar>
                <AvatarImage src={user.userInfo?.image} />
                <AvatarFallback className="text-primary">{userRole[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() =>
                  router.push(userRole === 'manager' ? '/managers/properties' : '/tenants/favorites', {
                    scroll: false,
                  })
                }
                title="Dashboard"
              >
                Dashboard
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(userRole === 'manager' ? '/managers/new-property' : '/search')}
                title={userRole === 'manager' ? 'Add New Property' : 'Search Properties'}
              >
                {userRole === 'manager' ? 'Add New Property' : 'Search Properties'}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/${userRole}s/settings`, { scroll: false })}
                title="Settings"
              >
                Settings
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer" onClick={() => handleSignOut()} title="Sign out">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button
                className="text-secondary bg-primary cursor-pointer"
                variant="outline"
                title="Sign In to Realtor Manager"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/signup">
              <Button
                className="bg-secondary text-primary cursor-pointer"
                variant="secondary"
                title="Sign Up for Realtor Manager"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default AppNavbar
