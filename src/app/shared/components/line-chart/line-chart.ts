import { Component, computed, input, signal } from '@angular/core';

import { ChartSeries } from '../../../core/models/metrics';
import { CHART_COLORS, labelStride, niceTicks, round1 } from '../../utils/chart-scale';
import { injectElementWidth } from '../../utils/element-width';
import { formatCompact } from '../../utils/format';

// Space around the plot area for axis labels (px)
const PADDING = { top: 12, right: 16, bottom: 28, left: 52 };

// Dependency-free SVG line chart. The component measures its own width with a ResizeObserver
// and draws in real pixels, so text and strokes stay crisp at any size (no viewBox scaling).
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
  host: { class: 'block min-w-0' },
})
export class LineChart {
  // x-axis labels, shared by every series
  readonly labels = input.required<string[]>();
  readonly series = input.required<ChartSeries[]>();
  readonly height = input(260);
  // Fill the area under the first series
  readonly area = input(true);
  readonly valueFormat = input<(value: number) => string>(formatCompact);
  readonly ariaLabel = input('Line chart');

  // Measured width of the host element (600px until measured, and in jsdom tests)
  protected readonly width = injectElementWidth();
  protected readonly activeIndex = signal<number | null>(null);

  protected readonly chart = computed(() => {
    const width = this.width();
    const height = this.height();
    const labels = this.labels();
    const format = this.valueFormat();

    const innerWidth = Math.max(width - PADDING.left - PADDING.right, 1);
    const innerHeight = Math.max(height - PADDING.top - PADDING.bottom, 1);
    const baseline = PADDING.top + innerHeight;

    const ticks = niceTicks(Math.max(0, ...this.series().flatMap((s) => s.data)));
    const top = ticks[ticks.length - 1];
    const step = labels.length > 1 ? innerWidth / (labels.length - 1) : 0;

    const x = (i: number) => round1(PADDING.left + i * step);
    const y = (value: number) => round1(baseline - (value / top) * innerHeight);

    const lines = this.series().map((s, index) => {
      const points = s.data.map((value, i) => ({ x: x(i), y: y(value), value }));
      const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
      const last = points[points.length - 1];
      const areaPath = points.length
        ? `${line} L${last.x},${baseline} L${points[0].x},${baseline} Z`
        : '';
      return {
        name: s.name,
        color: s.color ?? CHART_COLORS[index % CHART_COLORS.length],
        line,
        area: areaPath,
        points,
      };
    });

    // Keep the last label (most recent period) and step backwards from it
    const stride = labelStride(labels.length, innerWidth, 56);
    const xLabels = labels
      .map((text, i) => ({ text, x: x(i), i }))
      .filter((label) => (labels.length - 1 - label.i) % stride === 0);

    return {
      width,
      height,
      step,
      baseline,
      left: PADDING.left,
      right: width - PADDING.right,
      lines,
      xLabels,
      yTicks: ticks.map((value) => ({ value, y: y(value), text: format(value) })),
    };
  });

  // Data for the hover tooltip and guide line
  protected readonly active = computed(() => {
    const index = this.activeIndex();
    if (index === null) return null;
    const chart = this.chart();
    const x = chart.lines[0]?.points[index]?.x ?? 0;
    return {
      x,
      // Flip the tooltip to the left side of the guide line on the right half of the chart
      alignRight: x > chart.width / 2,
      label: this.labels()[index],
      items: chart.lines.map((line) => ({
        name: line.name,
        color: line.color,
        y: line.points[index]?.y ?? 0,
        text: this.valueFormat()(line.points[index]?.value ?? 0),
      })),
    };
  });

  protected onPointerMove(event: PointerEvent): void {
    const { step, left } = this.chart();
    const count = this.labels().length;
    if (!count) return;
    const rect = (event.currentTarget as Element).getBoundingClientRect();
    const index = step ? Math.round((event.clientX - rect.left - left) / step) : 0;
    this.activeIndex.set(Math.min(Math.max(index, 0), count - 1));
  }
}
