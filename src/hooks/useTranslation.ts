import enTranslations from '../translations/en.json'
import frTranslations from '../translations/fr.json'

type Translations = typeof enTranslations

export const useTranslation = (): Translations => {
  const browserLang = navigator.language.toLowerCase().split('-')[0]
  return browserLang === 'fr' ? frTranslations : enTranslations
}
