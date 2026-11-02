import {
  formatCompact,
  formatCompactCurrency,
  formatCurrency,
  formatDuration,
  formatMetric,
  percentChange,
} from './format';

describe('format utils', () => {
  it('should format each metric type', () => {
    expect(formatMetric(24521, 'number')).toBe('24,521');
    expect(formatMetric(84200, 'currency')).toBe('$84,200');
    expect(formatMetric(3.6, 'percent')).toBe('3.6%');
    expect(formatMetric(222, 'duration')).toBe('3m 42s');
  });

  it('should format compact values for chart axes', () => {
    expect(formatCompact(84200)).toBe('84.2K');
    expect(formatCompact(1500000)).toBe('1.5M');
    expect(formatCompactCurrency(25000)).toBe('$25K');
    expect(formatCurrency(1080)).toBe('$1,080');
  });

  it('should format short durations in seconds', () => {
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(65)).toBe('1m 05s');
  });

  it('should compute percent change and guard against zero', () => {
    expect(percentChange(110, 100)).toBeCloseTo(10);
    expect(percentChange(90, 100)).toBeCloseTo(-10);
    expect(percentChange(5, 0)).toBe(0);
  });
});
