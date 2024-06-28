'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IProfileNavigation {
  icon: React.FC<any>
  title: string
  href: string
  deactivate?: boolean
  hidden?: boolean
}

const profileNavigation: IProfileNavigation[] = [
  {
    icon: User,
    title: 'Profile',
    href: 'settings',
  },
  {
    icon: Bell,
    title: 'Reminders',
    href: 'settings/reminders',
    deactivate: true,
  },
]

export const SettingsNavigation = () => {
  const pathname = usePathname()
  const isActive = (href: string) => pathname.includes(href)
  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-4">
      {profileNavigation.map((navItem) => {
        if (navItem.hidden) return null
        return (
          <Link
            key={navItem.href}
            href={navItem.href}
            className={cn(
              `inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-border outline outline-1 outline-border transition-all duration-200 ease-in-out`,
              {
                'bg-primary hover:bg-primary text-primary-background outline-primary':
                  isActive(navItem.href),
                'opacity-50 cursor-not-allowed pointer-events-none':
                  navItem.deactivate,
              }
            )}
          >
            <navItem.icon className="w-4 h-4" />
            {navItem.title}
          </Link>
        )
      })}
    </nav>
  )
}
