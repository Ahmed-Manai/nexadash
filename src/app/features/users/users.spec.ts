import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Users } from './users';

describe('Users', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;
  let element: HTMLElement;

  const rows = () => Array.from(element.querySelectorAll('tr[mat-row]'));
  const firstCellTexts = () =>
    rows().map((row) => row.querySelector('.users__avatar + span')?.textContent?.trim());
  // Collapse template whitespace so assertions can match sentences
  const text = () => element.textContent?.replace(/\s+/g, ' ') ?? '';

  async function search(text: string) {
    const input = element.querySelector('input') as HTMLInputElement;
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Users],
    }).compileComponents();

    fixture = TestBed.createComponent(Users);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the first page of 10 users out of 48', () => {
    expect(rows()).toHaveLength(10);
    const paginator = fixture.debugElement.query(By.directive(MatPaginator)).componentInstance;
    expect(paginator.length).toBe(48);
    expect(text()).toContain('48 users');
  });

  it('should render name, e-mail, role, status badge and joined date', () => {
    const cells = Array.from(rows()[0].querySelectorAll('td')).map((td) => td.textContent?.trim());
    expect(cells).toEqual([
      'OBOlivia Bennett',
      'olivia.bennett@contoso.example',
      'Admin',
      'active',
      'Oct 31, 2026',
    ]);
    expect(rows()[0].querySelector('.badge')?.className).toContain('badge--success');
  });

  it('should filter by name, e-mail, role or status', async () => {
    await search('Olivia');
    expect(firstCellTexts()).toEqual(['Olivia Bennett', 'Olivia Novak', 'Olivia Hughes']);
    expect(text()).toContain('3 users matching "Olivia"');

    await search('suspended');
    rows().forEach((row) => expect(row.textContent).toContain('suspended'));
  });

  it('should show an empty state when nothing matches', async () => {
    await search('nobody-here');
    expect(rows()).toHaveLength(0);
    expect(element.textContent).toContain('No users match "nobody-here"');
  });

  it('should sort by name', async () => {
    const sort = fixture.debugElement.query(By.directive(MatSort)).injector.get(MatSort);
    sort.sort({ id: 'name', start: 'asc', disableClear: false });
    await fixture.whenStable();
    expect(firstCellTexts()[0]).toBe('Adam Diaz');
  });

  it('should page through results', async () => {
    const paginator = fixture.debugElement.query(By.directive(MatPaginator))
      .componentInstance as MatPaginator;
    paginator.lastPage();
    await fixture.whenStable();
    expect(rows()).toHaveLength(8);
  });
});
