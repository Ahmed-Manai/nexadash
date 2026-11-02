import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // ShellComponent wraps all authenticated pages — loaded as a layout wrapper
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'Dashboard · NexaDash',
        // Lazy load — the dashboard bundle is only downloaded when the user navigates here
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'users',
        title: 'Users · NexaDash',
        loadComponent: () => import('./features/users/users').then((m) => m.Users),
      },
      {
        path: 'analytics',
        title: 'Analytics · NexaDash',
        loadComponent: () => import('./features/analytics/analytics').then((m) => m.Analytics),
      },
      {
        path: 'settings',
        title: 'Settings · NexaDash',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
      },
    ],
  },
  // Catch-all: redirect unknown routes to dashboard
  { path: '**', redirectTo: '' },
];
