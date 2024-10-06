import { auth } from '@/auth'
import Navbar from '@/components/navbar'
import { redirect } from 'next/navigation'

const AppLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await auth()
  if (!session?.user) return redirect('/auth/signin')

  return (
    <div className="app-layout">
      <Navbar user={session.user} />
      <div className="flex flex-col mx-auto max-w-3xl py-12">
        <main>{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
