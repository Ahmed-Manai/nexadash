// Small helpers shared by the SVG chart components — pure functions, easy to unit test

// Default series colors: indigo-500, slate-400, sky-500, amber-500 — readable on light and dark cards
export const CHART_COLORS = ['#6366f1', '#94a3b8', '#0ea5e9', '#f59e0b'];

// Rounds a raw step up to 1, 2, 2.5 or 5 × 10^n so axis ticks land on "nice" values
export function niceStep(rawStep: number): number {
  if (rawStep <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

// Axis ticks from 0 up to a nice value ≥ max, e.g. niceTicks(84200) → [0, 25000, 50000, 75000, 100000]
export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1];
  const step = niceStep(max / count);
  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let value = 0; value <= top + step / 2; value += step) {
    // toFixed avoids floating point noise such as 0.30000000000000004
    ticks.push(Number(value.toFixed(10)));
  }
  return ticks;
}

// Show every n-th x-axis label so that labels keep at least `minSpacing` px between them
export function labelStride(count: number, availableWidth: number, minSpacing: number): number {
  if (count <= 1 || availableWidth <= 0) return 1;
  return Math.max(1, Math.ceil((count * minSpacing) / availableWidth));
}

// Rounds SVG coordinates to one decimal to keep the generated markup compact
export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
