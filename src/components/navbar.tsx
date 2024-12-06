'use client'

import Link from 'next/link'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import { HeartPulse, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface NavbarProps {
  user?: User
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const getUserInitials = (): string => {
    const name = user?.name ?? ''
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
    return initials.toUpperCase()
  }

  return (
    <header className="sticky top-0 flex items-center justify-between gap-4 px-4 md:px-6 h-16 border-b bg-background">
      <Link
        href="/app"
        className="flex items-center gap-2 text-lg font-semibold md:text-base hover:bg-muted/30 p-2 rounded-lg"
      >
        <HeartPulse className="h-6 w-6" />
        <span>Cardia</span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            {user?.image && <AvatarImage src={user.image} />}
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/app/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="bg-red-950 focus:bg-red-800"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Navbar
