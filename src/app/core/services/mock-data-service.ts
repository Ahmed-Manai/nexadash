import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  ANALYTICS_STATS,
  DASHBOARD_STATS,
  DEFAULT_PROFILE,
  RECENT_ORDERS,
  REVENUE,
  SESSIONS,
  SIGNUPS,
  TOP_PRODUCTS,
  TRAFFIC_SOURCES,
  USERS,
} from '../data/mock-data';
import { User, UserProfile } from '../models/user';

// Stand-in for a real API layer. Pages only talk to this service, so swapping the constants for
// HttpClient calls later does not touch any component.
@Injectable({ providedIn: 'root' })
export class MockDataService {
  // Read-only signals: components read them in templates like `service.dashboardStats()`
  readonly dashboardStats = signal(DASHBOARD_STATS).asReadonly();
  readonly revenue = signal(REVENUE).asReadonly();
  readonly topProducts = signal(TOP_PRODUCTS).asReadonly();
  readonly recentOrders = signal(RECENT_ORDERS).asReadonly();
  readonly users = signal(USERS).asReadonly();

  readonly analyticsStats = signal(ANALYTICS_STATS).asReadonly();
  readonly sessions = signal(SESSIONS).asReadonly();
  readonly trafficSources = signal(TRAFFIC_SOURCES).asReadonly();
  readonly signups = signal(SIGNUPS).asReadonly();

  // Writable internally, read-only to the outside world — same pattern as ThemeService
  private readonly _profile = signal<UserProfile>({ ...DEFAULT_PROFILE });
  readonly profile = this._profile.asReadonly();

  // Observable flavour for code that expects an HTTP-like API (e.g. resolvers or RxJS pipelines)
  getUsers(): Observable<User[]> {
    return of(USERS);
  }

  // Kept in memory only — there is no backend, so a reload restores the default profile
  updateProfile(profile: UserProfile): void {
    this._profile.set({ ...profile });
  }
}
