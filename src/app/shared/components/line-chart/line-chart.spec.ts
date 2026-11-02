import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChart } from './line-chart';

describe('LineChart', () => {
  let component: LineChart;
  let fixture: ComponentFixture<LineChart>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChart],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChart);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.componentRef.setInput('labels', ['Jan', 'Feb', 'Mar', 'Apr']);
    fixture.componentRef.setInput('series', [
      { name: 'This year', data: [10, 40, 25, 80] },
      { name: 'Last year', data: [5, 20, 30, 50] },
    ]);
    fixture.componentRef.setInput('ariaLabel', 'Revenue by month');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an accessible svg with one line per series plus the area', () => {
    const svg = element.querySelector('svg');
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-label')).toBe('Revenue by month');
    // 2 lines + 1 area fill under the first series
    expect(element.querySelectorAll('path')).toHaveLength(3);
  });

  it('should render nice y-axis ticks and every x label when there is room', () => {
    const texts = Array.from(element.querySelectorAll('text')).map((t) => t.textContent?.trim());
    expect(texts).toEqual(['0', '20', '40', '60', '80', 'Jan', 'Feb', 'Mar', 'Apr']);
  });

  it('should show a legend for multiple series', () => {
    const items = Array.from(element.querySelectorAll('li')).map((li) => li.textContent?.trim());
    expect(items).toEqual(['This year', 'Last year']);
  });

  it('should hide the legend and area when configured for a single series', async () => {
    fixture.componentRef.setInput('series', [{ name: 'Only', data: [1, 2, 3, 4] }]);
    fixture.componentRef.setInput('area', false);
    await fixture.whenStable();
    expect(element.querySelector('ul')).toBeNull();
    expect(element.querySelectorAll('path')).toHaveLength(1);
  });

  it('should show a tooltip for the nearest point on hover', async () => {
    const svg = element.querySelector('svg') as SVGSVGElement;
    // Default width 600 → plot from x=52 to x=584, so points are 177.3px apart; pick index 2
    svg.dispatchEvent(new MouseEvent('pointermove', { clientX: 52 + 2 * 177.3 }));
    await fixture.whenStable();

    const tooltip = element.querySelector('.line-chart__tooltip');
    expect(tooltip?.textContent).toContain('Mar');
    expect(tooltip?.textContent).toContain('This year: 25');
    expect(tooltip?.textContent).toContain('Last year: 30');
    expect(element.querySelectorAll('circle')).toHaveLength(2);

    svg.dispatchEvent(new MouseEvent('pointerleave'));
    await fixture.whenStable();
    expect(element.querySelector('.line-chart__tooltip')).toBeNull();
  });
});
