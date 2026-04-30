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
  
  // Încearcă să facă match între limbile browserului și ce avem noi pe site
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Verificăm dacă URL-ul are deja o limbă (ex: /ro/dashboard)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // 2. Dacă suntem pe rădăcină (/) sau pe o pagină fără limbă, detectăm limba
  const locale = getLocale(request)
  
  // 3. Redirecționăm (ex: de la / la /de)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Evităm fișierele interne, api-ul și pozele
    '/((?!api|_next/static|_next/image|favicon.ico|poze|public).*)',
  ],
}