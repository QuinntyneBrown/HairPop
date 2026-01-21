import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface UserPreference {
  id: string;
  key: string;
  value: string;
}

interface FavoriteBraider {
  id: string;
  braiderName: string;
  addedAt: string;
}

@Component({
  selector: 'hpa-user-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './user-detail-page.html',
  styleUrl: './user-detail-page.scss'
})
export class UserDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly userId = signal<string | null>(null);
  protected readonly isNew = signal(false);

  protected readonly email = signal('alex@example.com');
  protected readonly displayName = signal('Alex');
  protected readonly firstName = signal('Alexandra');
  protected readonly lastName = signal('Jones');
  protected readonly phoneNumber = signal('(555) 010-1234');
  protected readonly location = signal('Brooklyn, NY');
  protected readonly profileImageUrl = signal('https://.../user.jpg');

  protected readonly preferences = signal<UserPreference[]>([
    { id: '1', key: 'preferredStyle', value: 'knotless' },
    { id: '2', key: 'preferredLocation', value: 'NYC' }
  ]);

  protected readonly favorites = signal<FavoriteBraider[]>([
    { id: '1', braiderName: 'Janelle B.', addedAt: '2026-01-12' }
  ]);

  constructor() {
    this.route.params.subscribe(params => {
      if (params['id'] === 'new') {
        this.isNew.set(true);
        this.clearForm();
      } else {
        this.userId.set(params['id']);
        // In real app, load user data
      }
    });
  }

  private clearForm(): void {
    this.email.set('');
    this.displayName.set('');
    this.firstName.set('');
    this.lastName.set('');
    this.phoneNumber.set('');
    this.location.set('');
    this.profileImageUrl.set('');
    this.preferences.set([]);
    this.favorites.set([]);
  }

  protected save(): void {
    console.log('Saving user...');
    // In real app, call API
    this.router.navigate(['/users']);
  }

  protected delete(): void {
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user...');
      this.router.navigate(['/users']);
    }
  }

  protected addPreference(): void {
    const key = prompt('Enter preference key:');
    const value = prompt('Enter preference value:');
    if (key && value) {
      this.preferences.update(prefs => [...prefs, { id: Date.now().toString(), key, value }]);
    }
  }

  protected removePreference(id: string): void {
    this.preferences.update(prefs => prefs.filter(p => p.id !== id));
  }

  protected addFavorite(): void {
    const name = prompt('Enter braider name:');
    if (name) {
      this.favorites.update(favs => [...favs, { id: Date.now().toString(), braiderName: name, addedAt: new Date().toISOString().split('T')[0] }]);
    }
  }

  protected removeFavorite(id: string): void {
    this.favorites.update(favs => favs.filter(f => f.id !== id));
  }
}
