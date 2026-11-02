import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analytics } from './analytics';

describe('Analytics', () => {
  let component: Analytics;
  let fixture: ComponentFixture<Analytics>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analytics],
    }).compileComponents();

    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the analytics stat cards', () => {
    const cards = element.querySelectorAll('app-stat-card');
    expect(cards).toHaveLength(4);
    expect(cards[0].textContent).toContain('vs previous 30 days');
  });

  it('should render the sessions line chart and both bar charts', () => {
    expect(element.querySelectorAll('app-line-chart svg')).toHaveLength(1);
    expect(element.querySelectorAll('app-bar-chart svg')).toHaveLength(2);
  });

  it('should list every traffic source with its total', () => {
    const labels = Array.from(element.querySelectorAll('.bar-chart__label')).map((t) =>
      t.textContent?.trim(),
    );
    expect(labels).toEqual(['Organic search', 'Direct', 'Social', 'Paid ads', 'Referral', 'Email']);
    expect(element.textContent).toContain('21,940 visits in the last 30 days');
  });
});
