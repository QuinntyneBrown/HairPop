import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'hpa-booking-detail-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './booking-detail-page.html',
  styleUrl: './booking-detail-page.scss'
})
export class BookingDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly bookingId = signal<string | null>(null);
  protected readonly userName = signal('Alex');
  protected readonly userEmail = signal('alex@example.com');
  protected readonly braiderName = signal('Janelle B.');
  protected readonly serviceName = signal('Knotless Braids');
  protected readonly servicePrice = signal(200);
  protected readonly date = signal('2026-01-25');
  protected readonly time = signal('10:00 AM');
  protected readonly status = signal<'pending' | 'confirmed' | 'completed' | 'cancelled'>('confirmed');
  protected readonly notes = signal('Medium length, black color');

  constructor() {
    this.route.params.subscribe(params => {
      this.bookingId.set(params['id']);
    });
  }

  protected confirm(): void {
    this.status.set('confirmed');
  }

  protected complete(): void {
    this.status.set('completed');
  }

  protected cancel(): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.status.set('cancelled');
    }
  }

  protected getStatusClass(): string {
    switch (this.status()) {
      case 'confirmed': return 'badge--success';
      case 'pending': return 'badge--warning';
      case 'completed': return 'badge--info';
      case 'cancelled': return 'badge--error';
      default: return '';
    }
  }
}
