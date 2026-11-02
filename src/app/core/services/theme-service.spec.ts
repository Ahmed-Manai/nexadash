import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme-service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should apply an explicit theme choice', () => {
    service.setTheme('dark');
    expect(service.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('nexadash-theme')).toBe('dark');

    service.setTheme('light');
    expect(service.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should toggle between light and dark', () => {
    service.setTheme('light');
    service.toggle();
    expect(service.isDark).toBe(true);
  });
});
