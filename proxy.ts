import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let locales = ['de', 'ro', 'hu']
let defaultLocale = 'de'

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
  
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  // Verificăm dacă languages este valid pentru match
  return match(languages, locales, defaultLocale)
}

// Redenumirea funcției interne pentru claritate, deși exportul se face prin proxy
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. i18n Redirecționare
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    if (pathname.includes('.') || pathname.startsWith('/api/')) return
    const locale = getLocale(request)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
  }

  // 2. Protecție Rută /offer-create
  const currentLocale = locales.find((l) => pathname.startsWith(`/${l}`)) ?? defaultLocale
  const isOfferCreate = pathname.startsWith(`/${currentLocale}/offer-create`)

  if (isOfferCreate) {
    const userRole = request.cookies.get('tb_role')?.value ?? ''
    if (userRole === 'tb_buyer') {
      return NextResponse.redirect(new URL(`/${currentLocale}/dashboard`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|poze|public).*)',
  ],
}