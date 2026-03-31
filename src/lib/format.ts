const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  TRY: "₺",
  CAD: "CA$",
  CHF: "CHF",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  PLN: "zł",
};

const currencyLocales: Record<string, string> = {
  EUR: "de-DE",
  USD: "en-US",
  GBP: "en-GB",
  TRY: "tr-TR",
  CAD: "en-CA",
  CHF: "de-CH",
  SEK: "sv-SE",
  NOK: "nb-NO",
  DKK: "da-DK",
  PLN: "pl-PL",
};

export function formatCurrency(amount: number, currency = "EUR"): string {
  const locale = currencyLocales[currency] || "de-DE";
  const cur = currency || "EUR";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: cur,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for unknown currency codes
    const sym = currencySymbols[cur] || cur;
    return `${sym} ${Math.abs(amount).toFixed(2)}`;
  }
}

export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || currency;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
