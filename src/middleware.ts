import createMiddleware from 'next-easy-middlewares'
import supabaseAuth from './middlewares/supabase-auth'

const middlewares = {
  '/app/:path*': [supabaseAuth],
}

export const middleware = createMiddleware(middlewares)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|favicon.ico).*)',
  ],
}
