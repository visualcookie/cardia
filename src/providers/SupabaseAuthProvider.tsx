'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AuthContextProps {
  user: User | null
}

interface Props {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase.auth.getUser()
      setUser(data.user)

      if (error) {
        redirect('/auth/signin')
      }
    })()

    return () => {
      // this now gets called when the component unmounts
    }
  }, [supabase.auth])

  const value = useMemo(() => ({ user }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
