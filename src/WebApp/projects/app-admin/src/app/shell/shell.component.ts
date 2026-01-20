import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../core/auth/auth.service';

interface NavMenuItem {
  label: string;
  icon: string;
  route: string;
}

interface NavMenuSection {
  title: string;
  items: NavMenuItem[];
}

@Component({
  selector: 'hpa-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private authService = inject(AuthService);

  sidenavExpanded = signal(true);

  readonly user = this.authService.user;

  readonly menuSections: NavMenuSection[] = [
    {
      title: 'Main',
      items: [
        { label: 'Dashboard', icon: 'dashboard', route: '/' },
        { label: 'Users', icon: 'people', route: '/users' },
        { label: 'Braiders', icon: 'content_cut', route: '/braiders' },
        { label: 'Bookings', icon: 'event', route: '/bookings' }
      ]
    },
    {
      title: 'Content',
      items: [
        { label: 'Reviews', icon: 'star', route: '/reviews' },
        { label: 'Media', icon: 'image', route: '/media' }
      ]
    },
    {
      title: 'Administration',
      items: [
        { label: 'Roles', icon: 'admin_panel_settings', route: '/roles' },
        { label: 'Permissions', icon: 'security', route: '/permissions' },
        { label: 'API Keys', icon: 'vpn_key', route: '/api-keys' },
        { label: 'Settings', icon: 'settings', route: '/settings' }
      ]
    }
  ];

  get userInitials(): string {
    const user = this.user();
    if (!user) return 'AD';
    const name = user.displayName || user.email;
    const parts = name.split(/[@\s]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  toggleSidenav(): void {
    this.sidenavExpanded.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
