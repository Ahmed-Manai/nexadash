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
        // Lazy load — the dashboard bundle is only downloaded when the user navigates here
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
    ],
  },
  // Catch-all: redirect unknown routes to dashboard
  { path: '**', redirectTo: '' },
];
