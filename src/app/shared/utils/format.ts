import { MetricFormat } from '../../core/models/metrics';

// Formatters use a fixed locale so output is identical on every machine (and in tests)
const LOCALE = 'en-US';

const numberFormat = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const compactFormat = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
  maximumFractionDigits: 1,
});
const currencyFormat = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

// 84200 → "84.2K" — used for chart axes where space is tight
export function formatCompact(value: number): string {
  return compactFormat.format(value);
}

export function formatCurrency(value: number): string {
  return currencyFormat.format(value);
}

// 84200 → "$84.2K"
export function formatCompactCurrency(value: number): string {
  return `$${formatCompact(value)}`;
}

// 222 (seconds) → "3m 42s"
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes}m ${String(rest).padStart(2, '0')}s` : `${rest}s`;
}

export function formatMetric(value: number, format: MetricFormat): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'duration':
      return formatDuration(value);
    default:
      return formatNumber(value);
  }
}

// Relative change in percent; 0 when there is no previous value to compare with
export function percentChange(value: number, previous: number): number {
  if (previous === 0) return 0;
  return ((value - previous) / previous) * 100;
}
