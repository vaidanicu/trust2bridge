export const EXCHANGE_RATES = {
  EUR: 1,
  HUF: 362.83,
  RON: 5.1194,
};

export function getCurrencyByLang(lang: string) {
  if (lang === "hu") return "HUF";
  if (lang === "ro") return "RON";
  return "EUR";
}

export function formatConvertedPrice(price: any, lang: string) {
  const numericPrice = Number(price);

  if (!numericPrice || numericPrice <= 0) {
    return null;
  }

  const currency = getCurrencyByLang(lang);
  const convertedPrice = numericPrice * EXCHANGE_RATES[currency];

  return new Intl.NumberFormat(
    lang === "ro" ? "ro-RO" : lang === "hu" ? "hu-HU" : "de-DE",
    {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "EUR" ? 2 : 0,
    }
  ).format(convertedPrice);
}