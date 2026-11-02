import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { MockDataService } from './mock-data-service';

describe('MockDataService', () => {
  let service: MockDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose four dashboard stats with previous values for the trend', () => {
    const stats = service.dashboardStats();
    expect(stats.map((s) => s.id)).toEqual(['users', 'revenue', 'sessions', 'conversion']);
    stats.forEach((stat) => expect(stat.previous).toBeGreaterThan(0));
  });

  it('should keep the revenue chart consistent with the revenue stat card', () => {
    const revenueStat = service.dashboardStats().find((s) => s.id === 'revenue');
    const { labels, series } = service.revenue();
    expect(labels).toHaveLength(12);
    series.forEach((s) => expect(s.data).toHaveLength(labels.length));
    expect(series[0].data.at(-1)).toBe(revenueStat?.value);
  });

  it('should split current revenue across top products', () => {
    const total = service.topProducts().reduce((sum, p) => sum + p.revenue, 0);
    expect(total).toBe(84200);
  });

  it('should generate 48 users with unique names and e-mails', () => {
    const users = service.users();
    expect(users).toHaveLength(48);
    expect(new Set(users.map((u) => u.name)).size).toBe(48);
    expect(new Set(users.map((u) => u.email)).size).toBe(48);
    users.forEach((u) => expect(u.joined).toMatch(/^\d{4}-\d{2}-\d{2}$/));
  });

  it('should be deterministic across instances', () => {
    const other = new MockDataService();
    expect(other.users()).toEqual(service.users());
    expect(other.sessions()).toEqual(service.sessions());
    expect(service.users()[0]).toEqual({
      id: 1,
      name: 'Olivia Bennett',
      email: 'olivia.bennett@contoso.example',
      role: 'Admin',
      status: 'active',
      joined: '2026-10-31',
    });
  });

  it('should provide 30 days of sessions for two periods', () => {
    const { labels, series } = service.sessions();
    expect(labels).toHaveLength(30);
    expect(labels.at(-1)).toBe('Oct 31');
    expect(series).toHaveLength(2);
    series.forEach((s) => expect(s.data).toHaveLength(30));
  });

  it('should return users as an observable', async () => {
    const users = await firstValueFrom(service.getUsers());
    expect(users).toEqual(service.users());
  });

  it('should update the profile', () => {
    const updated = { ...service.profile(), fullName: 'Alex Morgan' };
    service.updateProfile(updated);
    expect(service.profile().fullName).toBe('Alex Morgan');
  });
});
