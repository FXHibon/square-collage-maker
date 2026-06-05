import { useState, useCallback, useEffect } from 'react';

export const translations = {
  en: {
    appName: "GridBuilder",
    pro: "Pro",
    imagesSelected: "{count} Image{plural} Selected",
    exportResult: "Export Result",
    sourceImages: "Source Images ({count})",
    clearAll: "Clear All",
    addMorePhotos: "Add more photos",
    layoutConfig: "Layout Configuration",
    gridShape: "Grid Shape",
    perfectSquare: "Perfect Square",
    squareShape: "Square (NxN)",
    linearShape: "Linear (1xN)",
    generateGrid: "Generate Grid",
    processing: "Processing...",
    statusProcessing: "Status: Processing",
    statusReady: "Status: Ready",
    statusIdle: "Status: Idle",
    processingComplete: "Processing Complete",
    waitingForInput: "Waiting for input",
    resDynamic: "Resolution: Dynamic based on source",
    resPending: "Resolution: Pending",
    selectImages: "Select images to begin",
    generatedCollageAlt: "Generated Collage",
    regenerate: "Regenerate",
    imagesProcessed: "Images Processed: {count}",
    autoStitch: "Auto-Stitch Mode: Enabled",
    errorGenerating: "An error occurred while generating the collage.",
    linearTooltip: "Linear style not currently implemented for arbitrary n items"
  },
  fr: {
    appName: "GridBuilder",
    pro: "Pro",
    imagesSelected: "{count} image{plural} sélectionnée{plural}",
    exportResult: "Exporter le résultat",
    sourceImages: "Images sources ({count})",
    clearAll: "Tout effacer",
    addMorePhotos: "Ajouter des photos",
    layoutConfig: "Configuration de la mise en page",
    gridShape: "Forme de la grille",
    perfectSquare: "Carré parfait",
    squareShape: "Carré (NxN)",
    linearShape: "Linéaire (1xN)",
    generateGrid: "Générer la grille",
    processing: "Traitement en cours...",
    statusProcessing: "Statut : Traitement en cours",
    statusReady: "Statut : Prêt",
    statusIdle: "Statut : En attente",
    processingComplete: "Traitement terminé",
    waitingForInput: "En attente d'images",
    resDynamic: "Résolution : Dynamique selon la source",
    resPending: "Résolution : En attente",
    selectImages: "Sélectionnez des images pour commencer",
    generatedCollageAlt: "Collage généré",
    regenerate: "Régénérer",
    imagesProcessed: "Images traitées : {count}",
    autoStitch: "Mode Auto-Stitch : Activé",
    errorGenerating: "Une erreur est survenue lors de la génération du collage.",
    linearTooltip: "Le style linéaire n'est pas encore implémenté pour un nombre arbitraire d'éléments"
  }
} as const;

export type Language = 'en' | 'fr';
export type TranslationKey = keyof typeof translations.en;

// Helper to determine the initial language based on browser setting
export function getBrowserLanguage(): Language {
  // If we are in a browser context
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    const primaryLang = browserLang.split('-')[0].toLowerCase();
    if (primaryLang === 'fr') {
      return 'fr';
    }
  }
  return 'en';
}

export function useTranslation() {
  const [lang, setLangState] = useState<Language>(getBrowserLanguage());

  // Listen to browser language changes or allow manual override
  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('preferred-language', newLang);
  }, []);

  // Initialize language preference from localStorage if set, otherwise browser language
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred-language') as Language | null;
    if (savedLang === 'en' || savedLang === 'fr') {
      setLangState(savedLang);
    } else {
      setLangState(getBrowserLanguage());
    }
  }, []);

  const t = useCallback((key: TranslationKey, variables?: Record<string, string | number>) => {
    let text: string = translations[lang][key] || translations['en'][key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }, [lang]);

  return { lang, setLang, t };
}
