import { useState, useEffect } from 'react'
import enTranslations from '../translations/en.json'
import frTranslations from '../translations/fr.json'

type Translations = typeof enTranslations

export function useTranslation() {
  const [translations, setTranslations] = useState<Translations>(frTranslations)

  useEffect(() => {
    const browserLang = navigator.language.toLowerCase().split('-')[0]

    if (browserLang === 'fr') {
      setTranslations(frTranslations)
    } else {
      setTranslations(enTranslations)
    }
  }, [])

  return translations
}
