import { I18n } from 'i18n-js';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';

const i18n = new I18n(
  { 'pt-BR': ptBR, en, es },
  { defaultLocale: 'pt-BR', enableFallback: true },
);
i18n.locale = 'pt-BR';

export type Locale = 'pt-BR' | 'en' | 'es';

export const LOCALES: { id: Locale; label: string }[] = [
  { id: 'pt-BR', label: 'Português' },
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
];

export default i18n;
export { i18n };
