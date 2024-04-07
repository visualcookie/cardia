'use client'

import { HeartPulse, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/types/user'

interface Props {
  user: User
}

const Navbar: React.FC<Props> = ({ user }) => {
  const supabase = createClient()
  const router = useRouter()

  const getUserInitials = (): string => {
    const name = user.username ?? ''
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
    return initials.toUpperCase()
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error logging out:', error.message)
      return
    }

    router.push('/auth/signin')
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
            {user.profilePicture && <AvatarImage src={user.profilePicture} />}
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
            onClick={handleLogout}
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
