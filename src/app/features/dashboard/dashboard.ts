import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { Order, OrderStatus } from '../../core/models/order';
import { MockDataService } from '../../core/services/mock-data-service';
import { LineChart } from '../../shared/components/line-chart/line-chart';
import { StatCard } from '../../shared/components/stat-card/stat-card';
import { formatCompactCurrency, formatCurrency } from '../../shared/utils/format';

// Badge modifier per order status — full class names so Tailwind keeps them
const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  paid: 'badge--success',
  pending: 'badge--warning',
  refunded: 'badge--neutral',
  failed: 'badge--danger',
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatTableModule, StatCard, LineChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly data = inject(MockDataService);

  protected readonly stats = this.data.dashboardStats;
  protected readonly revenue = this.data.revenue;
  protected readonly recentOrders = this.data.recentOrders;

  protected readonly orderColumns = ['id', 'customer', 'product', 'date', 'amount', 'status'];

  // Chart axis/tooltip formatter: 84200 → "$84.2K"
  protected readonly currencyAxis = formatCompactCurrency;
  protected readonly currency = formatCurrency;

  // Sum of the current 12-month series, shown above the chart
  protected readonly twelveMonthTotal = computed(() =>
    (this.revenue().series[0]?.data ?? []).reduce((sum, value) => sum + value, 0),
  );

  // Top products with their share of the best seller, for the progress bars
  protected readonly topProducts = computed(() => {
    const products = this.data.topProducts();
    const best = Math.max(...products.map((p) => p.revenue), 1);
    return products.map((p) => ({ ...p, share: Math.round((p.revenue / best) * 100) }));
  });

  // Typed helper: mat-table row variables are untyped in the template
  protected statusBadge(order: Order): string {
    return ORDER_STATUS_BADGE[order.status];
  }
}
