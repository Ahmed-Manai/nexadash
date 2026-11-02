import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { StatMetric } from '../../../core/models/metrics';
import { formatMetric, percentChange } from '../../utils/format';

type Trend = 'up' | 'down' | 'flat';

// Full class strings (not built dynamically) so Tailwind can find them when purging
const TREND_CLASSES: Record<'good' | 'bad' | 'neutral', string> = {
  good: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  bad: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

// Presentational card: metric in through an input, no service access
@Component({
  selector: 'app-stat-card',
  imports: [MatIconModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
})
export class StatCard {
  readonly metric = input.required<StatMetric>();
  readonly comparisonLabel = input('vs last month');

  protected readonly value = computed(() =>
    formatMetric(this.metric().value, this.metric().format),
  );

  protected readonly change = computed(() =>
    percentChange(this.metric().value, this.metric().previous),
  );

  protected readonly trend = computed<Trend>(() => {
    const change = Math.round(this.change() * 10) / 10;
    return change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  });

  protected readonly changeText = computed(() => `${Math.abs(this.change()).toFixed(1)}%`);

  protected readonly trendClass = computed(() => {
    const trend = this.trend();
    if (trend === 'flat') return TREND_CLASSES.neutral;
    // "up" is good news unless the metric is one where lower is better (e.g. bounce rate)
    const good = (trend === 'up') !== !!this.metric().lowerIsBetter;
    return good ? TREND_CLASSES.good : TREND_CLASSES.bad;
  });

  protected readonly trendIcon = computed(() => {
    const icons: Record<Trend, string> = {
      up: 'arrow_upward',
      down: 'arrow_downward',
      flat: 'remove',
    };
    return icons[this.trend()];
  });

  // Screen-reader text replacing the arrow icon
  protected readonly trendWord = computed(() => {
    const words: Record<Trend, string> = { up: 'Up', down: 'Down', flat: 'No change' };
    return words[this.trend()];
  });
}
