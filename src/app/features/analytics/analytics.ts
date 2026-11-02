import { Component, computed, inject } from '@angular/core';

import { MockDataService } from '../../core/services/mock-data-service';
import { BarChart } from '../../shared/components/bar-chart/bar-chart';
import { LineChart } from '../../shared/components/line-chart/line-chart';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { formatNumber } from '../../shared/utils/format';

@Component({
  selector: 'app-analytics',
  imports: [StatCard, LineChart, BarChart],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private readonly data = inject(MockDataService);

  protected readonly stats = this.data.analyticsStats;
  protected readonly sessions = this.data.sessions;
  protected readonly trafficSources = this.data.trafficSources;
  protected readonly signups = this.data.signups;

  // Full numbers for the horizontal bars, where there is room for them: 7340 → "7,340"
  protected readonly fullNumber = formatNumber;

  protected readonly totalVisits = computed(() =>
    this.trafficSources().reduce((sum, source) => sum + source.value, 0),
  );
}
