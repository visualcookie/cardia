import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { users } from '@/db/schema'
import { createClient } from '@/lib/supabase/server'
import { AuthProvider } from '@/providers/SupabaseAuthProvider'
import Navbar from '@/components/Navbar'

const AppLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/auth/signin')
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, data.user?.id),
  })

  if (!dbUser) {
    redirect('/app/welcome/onboarding')
  }

  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar user={dbUser} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:px-14">
          <main>{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}

export default AppLayout
