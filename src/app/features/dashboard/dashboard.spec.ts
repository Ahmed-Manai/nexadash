import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a stat card per dashboard metric', () => {
    const cards = element.querySelectorAll('app-stat-card');
    expect(cards).toHaveLength(4);
    expect(cards[1].textContent).toContain('$84,200');
  });

  it('should render the revenue chart with the 12-month total', () => {
    expect(element.querySelector('app-line-chart svg')).toBeTruthy();
    expect(element.textContent).toContain('$789,250');
  });

  it('should list top products', () => {
    expect(element.querySelectorAll('.dashboard__products li')).toHaveLength(5);
  });

  it('should render the recent orders table with status badges', () => {
    const rows = element.querySelectorAll('tr[mat-row]');
    expect(rows).toHaveLength(8);
    expect(rows[0].textContent).toContain('ORD-10482');
    expect(rows[0].textContent).toContain('Oct 31, 2026');
    expect(rows[0].querySelector('.badge')?.className).toContain('badge--success');
  });
});
