export function formatCurrency(amount: number | string, currency = 'EUR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatMonth(dateStr: string): string {
  return new Date(dateStr + '-01').toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}
