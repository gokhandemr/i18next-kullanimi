import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

// Uygulamanın desteklediği diller.
export const locales = ['en', 'tr']

// Bu fonksiyon, tarayıcının gönderdiği dil bilgisini (Accept-Language) okuyarak kullanıcıya en uygun dili belirlemek için kullanılır.
function getLocale(request: NextRequest) {
    const acceptLanguage = request.headers.get('accept-language') || '';
    const preferred = acceptLanguage.split(',')[0];
    return locales.includes(preferred) ? preferred : 'en';
}

export function middleware(request: NextRequest) {
    // Kullanıcının ziyaret ettiği URL yolunu alıp, dil kontrolü yapıyoruz eğer dil yönlendirmesi varsa url'de olduğuğu gibi devam ediyoruz. 
    const { pathname } = request.nextUrl
    const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
    if (pathnameHasLocale) return

    // Url'de dil yönlendirmesi yoksa yukarda yazmış olduğumuz "getLocale" fonksiyonu ile yönlendirme işlemi yapıyoruz.
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname.toLowerCase()}`
    return NextResponse.redirect(request.nextUrl)
}

export const config = {
    matcher: ['/((?!_next).*)'],
}