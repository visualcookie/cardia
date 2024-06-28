import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AuthProvider } from '@/providers/SupabaseAuthProvider'
import Navbar from '@/components/Navbar'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { profile } from '@/db/schema'

const AppLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/signin')
  }

  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar user={{ id: '123', username: 'visualcookie', avatar: '' }} />
        <div className="flex flex-col mx-auto max-w-3xl py-12">
          <main>{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default AppLayout
