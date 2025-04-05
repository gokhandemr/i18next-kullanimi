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
