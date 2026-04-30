// lib/dictionary.ts
const dictionaries = {
  de: () => import('./de.json').then((module) => module.default),
  ro: () => import('./ro.json').then((module) => module.default),
  hu: () => import('./hu.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'de' | 'ro' | 'hu') => dictionaries[locale]();