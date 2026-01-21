import { Component, signal } from '@angular/core';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface PermissionCategory {
  name: string;
  permissions: Permission[];
}

@Component({
  selector: 'hpa-permissions-page',
  standalone: true,
  imports: [],
  templateUrl: './permissions-page.html',
  styleUrl: './permissions-page.scss'
})
export class PermissionsPage {
  protected readonly categories = signal<PermissionCategory[]>([
    {
      name: 'Users',
      permissions: [
        { id: '1', name: 'users.read', description: 'View user profiles', category: 'Users' },
        { id: '2', name: 'users.write', description: 'Create and edit users', category: 'Users' },
        { id: '3', name: 'users.delete', description: 'Delete user accounts', category: 'Users' }
      ]
    },
    {
      name: 'Braiders',
      permissions: [
        { id: '4', name: 'braiders.read', description: 'View braider profiles', category: 'Braiders' },
        { id: '5', name: 'braiders.write', description: 'Create and edit braiders', category: 'Braiders' },
        { id: '6', name: 'braiders.delete', description: 'Delete braider accounts', category: 'Braiders' },
        { id: '7', name: 'braiders.approve', description: 'Approve new braider registrations', category: 'Braiders' }
      ]
    },
    {
      name: 'Bookings',
      permissions: [
        { id: '8', name: 'bookings.read', description: 'View booking details', category: 'Bookings' },
        { id: '9', name: 'bookings.write', description: 'Create and modify bookings', category: 'Bookings' },
        { id: '10', name: 'bookings.cancel', description: 'Cancel bookings', category: 'Bookings' }
      ]
    },
    {
      name: 'Reviews',
      permissions: [
        { id: '11', name: 'reviews.read', description: 'View reviews', category: 'Reviews' },
        { id: '12', name: 'reviews.moderate', description: 'Approve and flag reviews', category: 'Reviews' },
        { id: '13', name: 'reviews.delete', description: 'Delete reviews', category: 'Reviews' }
      ]
    },
    {
      name: 'Media',
      permissions: [
        { id: '14', name: 'media.read', description: 'View media files', category: 'Media' },
        { id: '15', name: 'media.upload', description: 'Upload media files', category: 'Media' },
        { id: '16', name: 'media.delete', description: 'Delete media files', category: 'Media' }
      ]
    },
    {
      name: 'Administration',
      permissions: [
        { id: '17', name: 'admin.roles', description: 'Manage roles', category: 'Administration' },
        { id: '18', name: 'admin.permissions', description: 'Manage permissions', category: 'Administration' },
        { id: '19', name: 'admin.api-keys', description: 'Manage API keys', category: 'Administration' },
        { id: '20', name: 'admin.settings', description: 'Manage system settings', category: 'Administration' }
      ]
    }
  ]);
}
