import { Component, signal } from '@angular/core';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string | null;
  status: 'active' | 'expired' | 'revoked';
  scopes: string[];
}

@Component({
  selector: 'hpa-api-keys-page',
  standalone: true,
  imports: [],
  templateUrl: './api-keys-page.html',
  styleUrl: './api-keys-page.scss'
})
export class ApiKeysPage {
  protected readonly apiKeys = signal<ApiKey[]>([
    { id: '1', name: 'Production API', prefix: 'hp_prod_', createdAt: '2026-01-01', lastUsed: '2026-01-20', status: 'active', scopes: ['read', 'write'] },
    { id: '2', name: 'Mobile App', prefix: 'hp_mob_', createdAt: '2026-01-10', lastUsed: '2026-01-19', status: 'active', scopes: ['read'] },
    { id: '3', name: 'Development', prefix: 'hp_dev_', createdAt: '2025-12-15', lastUsed: null, status: 'expired', scopes: ['read', 'write', 'admin'] },
    { id: '4', name: 'Legacy Integration', prefix: 'hp_leg_', createdAt: '2025-06-01', lastUsed: '2025-11-30', status: 'revoked', scopes: ['read'] }
  ]);

  protected readonly showNewKeyModal = signal(false);
  protected readonly newKeyName = signal('');
  protected readonly generatedKey = signal<string | null>(null);

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'badge--success';
      case 'expired': return 'badge--warning';
      case 'revoked': return 'badge--error';
      default: return '';
    }
  }

  protected createKey(): void {
    // In real app, call API to create key
    const key = `hp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    this.generatedKey.set(key);
    this.apiKeys.update(keys => [...keys, {
      id: Date.now().toString(),
      name: this.newKeyName() || 'New API Key',
      prefix: key.substring(0, 8) + '_',
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      status: 'active',
      scopes: ['read']
    }]);
  }

  protected revokeKey(id: string): void {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      this.apiKeys.update(keys =>
        keys.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k)
      );
    }
  }

  protected closeModal(): void {
    this.showNewKeyModal.set(false);
    this.newKeyName.set('');
    this.generatedKey.set(null);
  }
}
