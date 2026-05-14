import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { ThemeService } from '../../core/services/theme-service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    // Sync the DOM class with the stored theme preference on first load
    this.themeService.initialize();
  }
}
