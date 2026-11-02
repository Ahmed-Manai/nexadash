// How a metric value should be displayed: 1,340 / $84,200 / 3.6% / 3m 42s
export type MetricFormat = 'number' | 'currency' | 'percent' | 'duration';

export interface StatMetric {
  id: string;
  label: string;
  icon: string;
  value: number;
  // Value for the previous period — used to compute the trend indicator
  previous: number;
  format: MetricFormat;
  // For metrics like bounce rate a decrease is good news
  lowerIsBetter?: boolean;
}

// A single labelled value, e.g. one bar in a bar chart
export interface ChartPoint {
  label: string;
  value: number;
}

// One line in a line chart; `data` is aligned with the chart's shared labels
export interface ChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface TimeSeries {
  labels: string[];
  series: ChartSeries[];
}
