import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'hpa-media-detail-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './media-detail-page.html',
  styleUrl: './media-detail-page.scss'
})
export class MediaDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly mediaId = signal<string | null>(null);
  protected readonly filename = signal('knotless-braids-1.jpg');
  protected readonly type = signal<'image' | 'video'>('image');
  protected readonly braiderName = signal('Janelle B.');
  protected readonly uploadedAt = signal('2026-01-20');
  protected readonly size = signal('2.4 MB');
  protected readonly dimensions = signal('1920x1080');
  protected readonly url = signal('https://example.com/media/knotless-braids-1.jpg');
  protected readonly status = signal<'active' | 'pending' | 'archived'>('active');

  constructor() {
    this.route.params.subscribe(params => {
      this.mediaId.set(params['id']);
    });
  }

  protected activate(): void {
    this.status.set('active');
  }

  protected archive(): void {
    this.status.set('archived');
  }

  protected delete(): void {
    if (confirm('Are you sure you want to delete this media file?')) {
      this.router.navigate(['/media']);
    }
  }

  protected getStatusClass(): string {
    switch (this.status()) {
      case 'active': return 'badge--success';
      case 'pending': return 'badge--warning';
      case 'archived': return 'badge--info';
      default: return '';
    }
  }
}
