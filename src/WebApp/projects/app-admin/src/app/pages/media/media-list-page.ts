import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MediaItem {
  id: string;
  filename: string;
  type: 'image' | 'video';
  braiderName: string;
  uploadedAt: string;
  size: string;
  status: 'active' | 'pending' | 'archived';
}

@Component({
  selector: 'hpa-media-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './media-list-page.html',
  styleUrl: './media-list-page.scss'
})
export class MediaListPage {
  protected readonly media = signal<MediaItem[]>([
    { id: '1', filename: 'knotless-braids-1.jpg', type: 'image', braiderName: 'Janelle B.', uploadedAt: '2026-01-20', size: '2.4 MB', status: 'active' },
    { id: '2', filename: 'goddess-locs-style.jpg', type: 'image', braiderName: 'Keisha R.', uploadedAt: '2026-01-19', size: '1.8 MB', status: 'active' },
    { id: '3', filename: 'cornrows-demo.mp4', type: 'video', braiderName: 'Nia S.', uploadedAt: '2026-01-18', size: '45.2 MB', status: 'pending' },
    { id: '4', filename: 'box-braids-portfolio.jpg', type: 'image', braiderName: 'Tamika W.', uploadedAt: '2026-01-15', size: '3.1 MB', status: 'archived' }
  ]);

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'badge--success';
      case 'pending': return 'badge--warning';
      case 'archived': return 'badge--info';
      default: return '';
    }
  }

  protected getTypeIcon(type: string): string {
    return type === 'video' ? 'videocam' : 'image';
  }
}
