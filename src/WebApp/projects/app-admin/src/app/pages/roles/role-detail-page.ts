import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Permission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
}

@Component({
  selector: 'hpa-role-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './role-detail-page.html',
  styleUrl: './role-detail-page.scss'
})
export class RoleDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly roleId = signal<string | null>(null);
  protected readonly isNew = signal(false);
  protected readonly name = signal('Moderator');
  protected readonly description = signal('Content moderation and user management');
  protected readonly isSystem = signal(false);

  protected readonly permissions = signal<Permission[]>([
    { id: '1', name: 'users.read', description: 'View users', granted: true },
    { id: '2', name: 'users.write', description: 'Create/edit users', granted: true },
    { id: '3', name: 'users.delete', description: 'Delete users', granted: false },
    { id: '4', name: 'braiders.read', description: 'View braiders', granted: true },
    { id: '5', name: 'braiders.write', description: 'Create/edit braiders', granted: true },
    { id: '6', name: 'braiders.delete', description: 'Delete braiders', granted: false },
    { id: '7', name: 'reviews.moderate', description: 'Moderate reviews', granted: true },
    { id: '8', name: 'media.manage', description: 'Manage media files', granted: true }
  ]);

  constructor() {
    this.route.params.subscribe(params => {
      if (params['id'] === 'new') {
        this.isNew.set(true);
        this.clearForm();
      } else {
        this.roleId.set(params['id']);
      }
    });
  }

  private clearForm(): void {
    this.name.set('');
    this.description.set('');
    this.permissions.update(perms => perms.map(p => ({ ...p, granted: false })));
  }

  protected save(): void {
    console.log('Saving role...');
    this.router.navigate(['/roles']);
  }

  protected delete(): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.router.navigate(['/roles']);
    }
  }

  protected togglePermission(id: string): void {
    this.permissions.update(perms =>
      perms.map(p => p.id === id ? { ...p, granted: !p.granted } : p)
    );
  }
}
