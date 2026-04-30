import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['de', 'ro', 'hu']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Verifică dacă pathname-ul are deja o limbă validă
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // 2. IMPORTANT: Ignoră fișierele din folderul public (imagini, etc.)
  // Dacă URL-ul conține un punct (ex: imagine.png), nu redirecționa
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api/')
  ) {
    return
  }

  // 3. Redirecționează către limba default
  const locale = 'de' 
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
}

export const config = {
  matcher: [
    // Excludem rutele interne Next.js și fișierele statice comune
    '/((?!_next/static|_next/image|api|favicon.ico).*)',
  ],
}