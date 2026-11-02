import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data-service';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-topbar',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  // inject() is the modern Angular DI API — equivalent to constructor(private theme: ThemeService)
  // It can be used anywhere in the injection context, not just constructors
  readonly themeService = inject(ThemeService);
  private readonly data = inject(MockDataService);

  // Avatar initials follow the profile edited on the Settings page
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
}
