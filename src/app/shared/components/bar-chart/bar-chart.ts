import { Component, computed, input } from '@angular/core';

import { ChartPoint } from '../../../core/models/metrics';
import { CHART_COLORS, labelStride, niceTicks, round1 } from '../../utils/chart-scale';
import { injectElementWidth } from '../../utils/element-width';
import { formatCompact } from '../../utils/format';

export type BarChartOrientation = 'vertical' | 'horizontal';

// Vertical layout: room for y-axis values on the left and x labels below
const PADDING = { top: 12, right: 8, bottom: 28, left: 44 };

// Horizontal layout: category label column on the left, value text on the right
const H_LABEL_WIDTH = 112;
const H_VALUE_WIDTH = 52;
const H_ROW_HEIGHT = 40;
const H_BAR_HEIGHT = 12;

// Dependency-free SVG bar chart. Vertical bars suit short labels (months); horizontal bars suit
// longer category names (traffic sources) and stay readable on narrow screens.
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
  host: { class: 'block min-w-0' },
})
export class BarChart {
  readonly data = input.required<ChartPoint[]>();
  readonly orientation = input<BarChartOrientation>('vertical');
  readonly color = input(CHART_COLORS[0]);
  // Only used by the vertical layout; horizontal height follows the number of rows
  readonly height = input(260);
  readonly valueFormat = input<(value: number) => string>(formatCompact);
  readonly ariaLabel = input('Bar chart');

  protected readonly width = injectElementWidth();

  protected readonly vertical = computed(() => {
    const width = this.width();
    const height = this.height();
    const data = this.data();
    const format = this.valueFormat();

    const innerWidth = Math.max(width - PADDING.left - PADDING.right, 1);
    const innerHeight = Math.max(height - PADDING.top - PADDING.bottom, 1);
    const baseline = PADDING.top + innerHeight;

    const ticks = niceTicks(Math.max(0, ...data.map((d) => d.value)));
    const top = ticks[ticks.length - 1];
    const slot = data.length ? innerWidth / data.length : innerWidth;
    const barWidth = Math.min(slot * 0.6, 40);
    const y = (value: number) => round1(baseline - (value / top) * innerHeight);

    const stride = labelStride(data.length, innerWidth, 40);
    const bars = data.map((d, i) => {
      const center = PADDING.left + slot * (i + 0.5);
      const barTop = y(d.value);
      return {
        label: d.label,
        title: `${d.label}: ${format(d.value)}`,
        x: round1(center - barWidth / 2),
        y: barTop,
        width: round1(barWidth),
        height: round1(baseline - barTop),
        center: round1(center),
        showLabel: (data.length - 1 - i) % stride === 0,
      };
    });

    return {
      width,
      height,
      left: PADDING.left,
      right: width - PADDING.right,
      bars,
      yTicks: ticks.map((value) => ({ value, y: y(value), text: format(value) })),
    };
  });

  protected readonly horizontal = computed(() => {
    const width = this.width();
    const data = this.data();
    const format = this.valueFormat();

    const trackWidth = Math.max(width - H_LABEL_WIDTH - H_VALUE_WIDTH, 1);
    const max = Math.max(0, ...data.map((d) => d.value)) || 1;

    const rows = data.map((d, i) => {
      const rowTop = i * H_ROW_HEIGHT;
      return {
        label: d.label,
        value: format(d.value),
        title: `${d.label}: ${format(d.value)}`,
        textY: rowTop + H_ROW_HEIGHT / 2,
        barY: rowTop + (H_ROW_HEIGHT - H_BAR_HEIGHT) / 2,
        barWidth: round1(Math.max((d.value / max) * trackWidth, 2)),
      };
    });

    return {
      width,
      height: data.length * H_ROW_HEIGHT,
      trackX: H_LABEL_WIDTH,
      trackWidth: round1(trackWidth),
      valueX: width,
      barHeight: H_BAR_HEIGHT,
      rows,
    };
  });
}
