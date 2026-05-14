import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'nexadash-theme';

  // BehaviorSubject: an Observable that holds a current value and emits it immediately to new subscribers.
  // This is how we share reactive state without NgRx for simple cases.
  private _theme$ = new BehaviorSubject<Theme>(this.getInitialTheme());

  // Public read-only Observable — components subscribe to this, never write to it directly
  readonly theme$ = this._theme$.asObservable();

  get isDark(): boolean {
    return this._theme$.value === 'dark';
  }

  toggle(): void {
    const next: Theme = this._theme$.value === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }

  private apply(theme: Theme): void {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(this.storageKey, theme);
    this._theme$.next(theme);
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    if (stored) return stored;
    // Respect OS preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Called once at app startup from AppComponent to sync the DOM with stored preference
  initialize(): void {
    this.apply(this._theme$.value);
  }
}
