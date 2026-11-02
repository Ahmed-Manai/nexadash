import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDataService } from '../../core/services/mock-data-service';
import { ThemeService } from '../../core/services/theme-service';
import { Settings } from './settings';

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;
  let element: HTMLElement;

  const input = (name: string) =>
    element.querySelector(`[formControlName="${name}"]`) as HTMLInputElement;
  const button = (label: string) =>
    Array.from(element.querySelectorAll('button')).find((b) =>
      b.textContent?.includes(label),
    ) as HTMLButtonElement;

  async function type(name: string, value: string) {
    const field = input(name);
    field.value = value;
    field.dispatchEvent(new Event('input'));
    field.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    await TestBed.configureTestingModule({
      imports: [Settings],
    }).compileComponents();

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prefill the form with the current profile', () => {
    expect(input('fullName').value).toBe('Jordan Doe');
    expect(input('email').value).toBe('jordan.doe@contoso.example');
    expect(button('Save profile').disabled).toBe(true);
  });

  it('should show validation errors for invalid input', async () => {
    await type('fullName', '');
    await type('email', 'not-an-email');
    const errors = Array.from(element.querySelectorAll('mat-error')).map((e) =>
      e.textContent?.trim(),
    );
    expect(errors).toEqual(['Full name is required.', 'Enter a valid e-mail address.']);
  });

  it('should not save an invalid form', async () => {
    const service = TestBed.inject(MockDataService);
    await type('fullName', 'J');
    button('Save profile').click();
    await fixture.whenStable();
    expect(service.profile().fullName).toBe('Jordan Doe');
    expect(element.textContent).toContain('Use at least 2 characters.');
  });

  it('should save a valid profile and become pristine again', async () => {
    const service = TestBed.inject(MockDataService);
    await type('fullName', 'Alex Morgan');
    expect(button('Save profile').disabled).toBe(false);

    button('Save profile').click();
    await fixture.whenStable();

    expect(service.profile().fullName).toBe('Alex Morgan');
    expect(button('Save profile').disabled).toBe(true);
    // The summary card shows the saved name and new initials
    expect(element.querySelector('.settings__avatar')?.textContent?.trim()).toBe('AM');
  });

  it('should discard unsaved changes', async () => {
    await type('fullName', 'Someone Else');
    button('Discard changes').click();
    await fixture.whenStable();
    expect(input('fullName').value).toBe('Jordan Doe');
  });

  it('should switch the theme through ThemeService', async () => {
    const themeService = TestBed.inject(ThemeService);
    const dark = Array.from(element.querySelectorAll('mat-button-toggle button')).find((b) =>
      b.textContent?.includes('Dark'),
    ) as HTMLButtonElement;

    dark.click();
    await fixture.whenStable();

    expect(themeService.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
