## Next.js Projesinde i18next Çoklu Dil Desteği Kullanımı

### 1- Kurulum

```
npm install next-i18next
```

### 2- middleware.ts dosyası

Taracıyı bilgilerini ve yönlendirme işlemleri için `middleware.ts` dosyası oluşturulmalı.

```
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
```

### 3- Dosya yapılandırması

Uygulama içindeki tüm sayfaların `app/[lang]` dosyasının altında olması gerekiyor.

- Örnek Anasayfa yapısı: `app>[lang]>page.tsx`
- Örnek Hakkımızda sayfası yapısı: `app>[lang]>about>page.tsx`

### 4- Dil Dosyaları

`dictionaries` klasörünü `[lang]` altında oluşturup dil dosyalarını oluşturuyoruz.

- Dosya yolu: `app>[lang]>dictionaries>en.json`
- Örnek `en.json` yapısı: `

```
{
  "home": {
    "title": "Hello world",
    "description": "Proident fugiat qui aliqua cillum duis pariatur mollit deserunt."
  },
  "about": {
    "title": "About",
    "description": "Ad consequat laborum pariatur adipisicing labore culpa do ea occaecat nisi consequat elit."
  }
}
```

### 5- getDictionary Fonksiyonu

Dil dosyalarını dinamik olarak sayfalara import etmek için yazılan fonksiyon.

```
import 'server-only';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  tr: () => import('./dictionaries/tr.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'tr') => dictionaries[locale]();
```

### 6- Switcher Button Componenti

Uygulama dilini değiştirmek için client side çalışan buton yapısı

```
'use client';

import { locales } from '@/middleware';
import { usePathname, useRouter } from 'next/navigation';

export default function SwitcherButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (locale: string) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return locales.map((locale, index) => (
    <button key={index} onClick={() => handleClick(locale)}>
      {locale}
    </button>
  ));
}
```
