import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './lib/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV !== 'production' ? true : false,
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    // newUser: '',
  },
  adapter: DrizzleAdapter(db),
  providers: [Resend({ from: 'noreply@cardia.sloth.sh' })],
  callbacks: {
    authorized({ auth }) {
      return !!auth
    },
  },
})
