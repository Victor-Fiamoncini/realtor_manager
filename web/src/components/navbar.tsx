import { signOut } from 'aws-amplify/auth'
import { Bell, MessageCircle, Plus, Search } from 'lucide-react'
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

export default function Navbar() {
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

        <Link className="cursor-pointer text-xl font-bold hover:text-primary-300" href="/" scroll={false}>
          Realtor Manager
        </Link>

        {isDashboardPage && user && (
          <Button
            className="bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50 md:ml-4"
            variant="secondary"
            onClick={() => router.push(userRole ? '/managers/newproperty' : '/search')}
            title={userRole === 'manager' ? 'Add New Property' : 'Search Properties'}
          >
            {userRole === 'manager' ? (
              <>
                <Plus className="h-4 w-4" />

                <span className="ml-2 hidden md:block">Add New Property</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />

                <span className="ml-2 hidden md:block">Search Properties</span>
              </>
            )}
          </Button>
        )}

        <div className="flex items-center gap-5">
          {user && userRole ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="h-6 w-6 cursor-pointer text-primary-200 hover:text-primary-400" />

                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-secondary-700" />
              </div>

              <div className="relative hidden md:block">
                <Bell className="h-6 w-6 cursor-pointer text-primary-200 hover:text-primary-400" />

                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-secondary-700" />
              </div>

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
            </>
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
