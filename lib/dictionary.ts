// lib/dictionary.ts

const dictionaries = {
  de: () => import('./de.json').then((module) => module.default),
  ro: () => import('./ro.json').then((module) => module.default),
  hu: () => import('./hu.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'de' | 'ro' | 'hu') => {
  // Verificăm dacă locale există în lista noastră, dacă nu, returnăm germana (de) implicit
  const loader = dictionaries[locale] || dictionaries.de;
  return loader();
};