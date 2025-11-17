import { Building, FileText, Heart, Home, Settings, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

const USER_TYPE_LABELS = {
  manager: 'Manager View',
  tenant: 'Renter View',
}

const NAV_LINKS = {
  manager: [
    { icon: Building, label: 'Properties', href: '/managers/properties' },
    { icon: FileText, label: 'Applications', href: '/managers/applications' },
    { icon: Settings, label: 'Settings', href: '/managers/settings' },
  ],
  tenant: [
    { icon: Heart, label: 'Favorites', href: '/tenants/favorites' },
    { icon: FileText, label: 'Applications', href: '/tenants/applications' },
    { icon: Home, label: 'Residences', href: '/tenants/residences' },
    { icon: Settings, label: 'Settings', href: '/tenants/settings' },
  ],
}

const SidebarTitle = ({ userType }) => (
  <h1 className="text-primary text-xl font-bold">{USER_TYPE_LABELS[userType] || ''}</h1>
)

const AppSidebar = ({ userType }) => {
  const pathname = usePathname()
  const { open, toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  const navLinks = NAV_LINKS[userType] || []

  return (
    <Sidebar
      className="min-h-screen shadow-lg"
      collapsible={isMobile ? 'offcanvas' : 'none'}
      style={{ height: 'unset' }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="mb-3 flex min-h-14 w-full items-center justify-between px-6 pt-3">
              {isMobile && open ? (
                <>
                  <SidebarTitle userType={userType} />
                  <button className="cursor-pointer rounded-md p-2" title="Toggle Menu" onClick={() => toggleSidebar()}>
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              ) : (
                <SidebarTitle userType={userType} />
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => {
            const isActive = pathname === link.href

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  className={cn(
                    'flex items-center px-7 py-7',
                    isActive ? 'bg-gray-100' : 'text-gray-600 hover:bg-gray-100'
                  )}
                  asChild
                >
                  <Link className="w-full" href={link.href} title={link.label} scroll={false}>
                    <div className="flex items-center gap-3">
                      <link.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-600'}`} />
                      <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
