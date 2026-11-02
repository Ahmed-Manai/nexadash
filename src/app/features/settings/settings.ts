import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MockDataService } from '../../core/services/mock-data-service';
import { Theme, ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly data = inject(MockDataService);
  private readonly themeService = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);
  // NonNullableFormBuilder: reset() goes back to the initial values instead of null
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly maxLength = { name: 60, text: 60, bio: 280 };

  protected readonly form = this.fb.group({
    fullName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(this.maxLength.name)],
    ],
    email: ['', [Validators.required, Validators.email]],
    jobTitle: ['', Validators.maxLength(this.maxLength.text)],
    company: ['', Validators.maxLength(this.maxLength.text)],
    bio: ['', Validators.maxLength(this.maxLength.bio)],
  });

  protected readonly profile = this.data.profile;

  protected readonly initials = computed(() =>
    this.profile()
      .fullName.split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );

  // Bridge the theme Observable into a signal; requireSync works because it is a BehaviorSubject
  protected readonly theme = toSignal(this.themeService.theme$, { requireSync: true });

  constructor() {
    this.form.reset(this.profile());
  }

  protected save(): void {
    if (this.form.invalid) {
      // Reveal every validation message at once
      this.form.markAllAsTouched();
      return;
    }
    const profile = this.form.getRawValue();
    this.data.updateProfile(profile);
    // Reset with the saved values so the form is pristine again (disables Save / Discard)
    this.form.reset(profile);
    this.snackBar.open('Profile saved', 'Dismiss', { duration: 3000 });
  }

  protected discard(): void {
    this.form.reset(this.profile());
  }

  protected setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }
}
