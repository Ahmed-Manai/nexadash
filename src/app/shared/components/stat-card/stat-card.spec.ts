import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatMetric } from '../../../core/models/metrics';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  let component: StatCard;
  let fixture: ComponentFixture<StatCard>;
  let element: HTMLElement;

  const revenue: StatMetric = {
    id: 'revenue',
    label: 'Revenue',
    icon: 'payments',
    value: 84200,
    previous: 76450,
    format: 'currency',
  };

  async function render(metric: StatMetric) {
    fixture.componentRef.setInput('metric', metric);
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCard],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCard);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await render(revenue);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the label and formatted value', () => {
    expect(element.textContent).toContain('Revenue');
    expect(element.querySelector('.stat-card__value')?.textContent?.trim()).toBe('$84,200');
  });

  it('should show a positive trend in green', () => {
    const badge = element.querySelector('.stat-card__badge') as HTMLElement;
    expect(badge.textContent).toContain('Up');
    expect(badge.textContent).toContain('10.1%');
    expect(badge.className).toContain('text-emerald-700');
  });

  it('should show a drop in red', async () => {
    await render({ ...revenue, value: 1340, previous: 1412, format: 'number' });
    const badge = element.querySelector('.stat-card__badge') as HTMLElement;
    expect(badge.textContent).toContain('Down');
    expect(badge.textContent).toContain('5.1%');
    expect(badge.className).toContain('text-rose-700');
  });

  it('should treat a drop as good news when lower is better', async () => {
    await render({
      ...revenue,
      value: 41.8,
      previous: 44.2,
      format: 'percent',
      lowerIsBetter: true,
    });
    const badge = element.querySelector('.stat-card__badge') as HTMLElement;
    expect(badge.textContent).toContain('Down');
    expect(badge.className).toContain('text-emerald-700');
  });

  it('should show a neutral badge when nothing changed', async () => {
    await render({ ...revenue, previous: revenue.value });
    const badge = element.querySelector('.stat-card__badge') as HTMLElement;
    expect(badge.textContent).toContain('No change');
    expect(badge.className).toContain('text-slate-600');
  });
});
