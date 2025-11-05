'use client'

import { signOut } from 'aws-amplify/auth'
import { Plus, Search } from 'lucide-react'
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
import { NAVBAR_HEIGHT } from '@/lib/constants'
import { useGetAuthUserQuery } from '@/state/api'
import Image from 'next/image'

const AppNavbar = () => {
  const { data: user } = useGetAuthUserQuery()

  const router = useRouter()
  const pathname = usePathname()

  const userRole = user?.userRole?.toLowerCase() || null
  const isDashboardPage = pathname.includes('/managers') || pathname.includes('/tenants')

  const handleSignOut = async () => {
    await signOut()

    window.location.href = '/'
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full shadow-xl" style={{ height: `${NAVBAR_HEIGHT}px` }}>
      <div className="flex h-full w-full items-center justify-between bg-primary-700 px-8 py-3 text-white">
        {isDashboardPage && (
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        )}

        <div className="flex items-center gap-6">
          <Link
            className="flex cursor-pointer items-center gap-4 text-xl font-bold hover:text-primary-300"
            href="/"
            scroll={false}
          >
            <Image src="/logo.png" alt="Realtor Manager Logo" width={40} height={40} />
            Realtor Manager
          </Link>

          {isDashboardPage && user && (
            <Button
              className="bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
              variant="outline"
              onClick={() => router.push(userRole ? '/managers/newproperty' : '/search')}
              title={userRole === 'manager' ? 'Add New Property' : 'Search Properties'}
            >
              {userRole === 'manager' ? (
                <>
                  <Plus className="h-4 w-4" />

                  <span className="hidden pr-1 md:block">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />

                  <span className="hidden pr-1 md:block">Search Properties</span>
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-5">
          {user && userRole ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                <Avatar>
                  <AvatarImage src={user.userInfo?.image} />

                  <AvatarFallback className="bg-primary-600">{userRole[0].toUpperCase()}</AvatarFallback>
                </Avatar>

                <p className="hidden text-primary-200 md:block">{user.userInfo?.name}</p>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-white text-primary-700">
                <DropdownMenuItem
                  className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                  onClick={() =>
                    router.push(userRole === 'manager' ? '/managers/properties' : '/tenants/favorites', {
                      scroll: false,
                    })
                  }
                  title="Dashboard"
                >
                  Dashboard
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-primary-200" />

                <DropdownMenuItem
                  className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                  onClick={() => router.push(`/${userRole}s/settings`, { scroll: false })}
                  title="Settings"
                >
                  Settings
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                  onClick={() => handleSignOut()}
                  title="Sign out"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signin">
                <Button
                  className="rounded-lg border-white bg-transparent text-white hover:bg-white hover:text-primary-700"
                  variant="outline"
                  title="Sign In to Realtor Manager"
                >
                  Sign In
                </Button>
              </Link>

              <Link href="/signup">
                <Button
                  className="rounded-lg bg-secondary-600 text-white hover:bg-white hover:text-primary-700"
                  variant="secondary"
                  title="Sign Up for Realtor Manager"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppNavbar
