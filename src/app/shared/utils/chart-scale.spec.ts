import { labelStride, niceStep, niceTicks } from './chart-scale';

describe('chart scale utils', () => {
  it('should round steps to nice values', () => {
    expect(niceStep(0.7)).toBe(1);
    expect(niceStep(18)).toBe(20);
    expect(niceStep(2300)).toBe(2500);
    expect(niceStep(4100)).toBe(5000);
    expect(niceStep(7000)).toBe(10000);
  });

  it('should produce ticks from zero to a nice maximum', () => {
    expect(niceTicks(84200)).toEqual([0, 25000, 50000, 75000, 100000]);
    expect(niceTicks(100)).toEqual([0, 25, 50, 75, 100]);
    expect(niceTicks(0.9)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('should fall back to a unit axis when there is no data', () => {
    expect(niceTicks(0)).toEqual([0, 1]);
  });

  it('should skip labels when space is tight', () => {
    expect(labelStride(12, 600, 40)).toBe(1);
    expect(labelStride(30, 300, 50)).toBe(5);
    expect(labelStride(1, 10, 50)).toBe(1);
  });
});
