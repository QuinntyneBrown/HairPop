import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

@Component({
  selector: 'hpa-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {
  protected readonly navSections = signal<NavSection[]>([
    {
      items: [
        { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
        { icon: 'content_cut', label: 'Braiders', route: '/braiders' },
        { icon: 'people', label: 'Users', route: '/users' },
        { icon: 'event', label: 'Bookings', route: '/bookings' },
        { icon: 'reviews', label: 'Reviews', route: '/reviews' },
        { icon: 'perm_media', label: 'Media', route: '/media' }
      ]
    },
    {
      title: 'Identity',
      items: [
        { icon: 'security', label: 'Roles', route: '/roles' },
        { icon: 'policy', label: 'Permissions', route: '/permissions' },
        { icon: 'vpn_key', label: 'API Keys', route: '/api-keys' }
      ]
    },
    {
      title: 'System',
      items: [
        { icon: 'settings', label: 'Settings', route: '/settings' },
        { icon: 'notifications', label: 'Notifications', route: '/notifications' },
        { icon: 'account_circle', label: 'Profile', route: '/profile' }
      ]
    }
  ]);

  protected readonly notificationCount = signal(3);
  protected readonly userInitials = signal('HA');
}
