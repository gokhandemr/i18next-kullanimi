import { getDictionary } from '../dictionaries';

export default async function About({ params }: { params: Promise<{ lang: 'en' | 'tr' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang); // en
  return (
    <div>
      {dict.about.title}
    </div>
  )
}
