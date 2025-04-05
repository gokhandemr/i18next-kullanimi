import { getDictionary } from './dictionaries';
import SwitcherButton from '../components/switcher-button';

export default async function Page({ params }: { params: Promise<{ lang: 'en' | 'tr' }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div>
      <p>Mevcut Dil: {lang}</p>
      <p>Karşılama Mesajı: {dict.home.title}</p>

      <SwitcherButton />
    </div>
  );
}
