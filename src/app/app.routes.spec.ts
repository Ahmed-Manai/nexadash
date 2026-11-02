import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';

describe('app routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    harness = await RouterTestingHarness.create();
  });

  // Every sidebar link should resolve to its own lazy-loaded page
  it.each([
    ['/dashboard', 'app-dashboard', 'Dashboard · NexaDash'],
    ['/users', 'app-users', 'Users · NexaDash'],
    ['/analytics', 'app-analytics', 'Analytics · NexaDash'],
    ['/settings', 'app-settings', 'Settings · NexaDash'],
  ])('should render %s', async (url, selector, title) => {
    await harness.navigateByUrl(url);
    expect(harness.routeNativeElement?.querySelector(selector)).toBeTruthy();
    expect(document.title).toBe(title);
  });

  it('should redirect the root and unknown URLs to the dashboard', async () => {
    const router = TestBed.inject(Router);
    await harness.navigateByUrl('/');
    expect(router.url).toBe('/dashboard');
    await harness.navigateByUrl('/does-not-exist');
    expect(router.url).toBe('/dashboard');
  });
});
