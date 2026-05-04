import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let locales = ['de', 'ro', 'hu']
let defaultLocale = 'de'

function getLocale(request: NextRequest) {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── 1. i18n: dacă URL-ul NU are limbă, detectează și redirecționează ────────
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    if (pathname.includes('.') || pathname.startsWith('/api/')) return
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // ── 2. Blochează /offer-create pentru tb_buyer ───────────────────────────────
  const isOfferCreate = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/offer-create`) ||
      pathname === `/${locale}/offer-create`
  )

  if (isOfferCreate) {
    const userRole = request.cookies.get('tb_role')?.value ?? ''
    if (userRole === 'tb_buyer') {
      const locale = locales.find((l) => pathname.startsWith(`/${l}`)) ?? defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|poze|public).*)',
  ],
}