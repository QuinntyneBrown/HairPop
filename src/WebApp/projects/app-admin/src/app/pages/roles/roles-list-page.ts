import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissionCount: number;
  isSystem: boolean;
}

@Component({
  selector: 'hpa-roles-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './roles-list-page.html',
  styleUrl: './roles-list-page.scss'
})
export class RolesListPage {
  protected readonly roles = signal<Role[]>([
    { id: '1', name: 'Administrator', description: 'Full system access', userCount: 2, permissionCount: 45, isSystem: true },
    { id: '2', name: 'Moderator', description: 'Content moderation and user management', userCount: 5, permissionCount: 20, isSystem: false },
    { id: '3', name: 'Braider', description: 'Braider account access', userCount: 48, permissionCount: 12, isSystem: true },
    { id: '4', name: 'User', description: 'Standard user access', userCount: 312, permissionCount: 8, isSystem: true }
  ]);
}
