import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChart } from './bar-chart';

describe('BarChart', () => {
  let component: BarChart;
  let fixture: ComponentFixture<BarChart>;
  let element: HTMLElement;

  const data = [
    { label: 'Organic search', value: 7340 },
    { label: 'Direct', value: 4820 },
    { label: 'Email', value: 1890 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChart],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChart);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.componentRef.setInput('data', data);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one bar per data point in vertical mode', () => {
    const bars = element.querySelectorAll('.bar-chart__bar rect');
    expect(bars).toHaveLength(3);
    const titles = Array.from(element.querySelectorAll('title')).map((t) => t.textContent);
    expect(titles).toEqual(['Organic search: 7.3K', 'Direct: 4.8K', 'Email: 1.9K']);
  });

  it('should make taller bars for larger values', () => {
    const heights = Array.from(element.querySelectorAll('.bar-chart__bar rect')).map((rect) =>
      Number(rect.getAttribute('height')),
    );
    expect(heights[0]).toBeGreaterThan(heights[1]);
    expect(heights[1]).toBeGreaterThan(heights[2]);
  });

  it('should render labelled rows with values in horizontal mode', async () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('valueFormat', (v: number) => `${v} visits`);
    await fixture.whenStable();

    const labels = Array.from(element.querySelectorAll('.bar-chart__label')).map((t) =>
      t.textContent?.trim(),
    );
    const values = Array.from(element.querySelectorAll('.bar-chart__value')).map((t) =>
      t.textContent?.trim(),
    );
    expect(labels).toEqual(['Organic search', 'Direct', 'Email']);
    expect(values).toEqual(['7340 visits', '4820 visits', '1890 visits']);
    // Height grows with the number of rows (40px each)
    expect(element.querySelector('svg')?.getAttribute('height')).toBe('120');
  });
});
