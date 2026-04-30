import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['de', 'ro', 'hu']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verifică dacă pathname-ul are deja o limbă validă
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Dacă nu are limbă, redirecționează către 'de' (sau detectează limba browserului)
  const locale = 'de' 
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!_next|api|backend|favicon.ico).*)',
  ],
}