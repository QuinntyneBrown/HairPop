import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Booking {
  id: string;
  userName: string;
  braiderName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

@Component({
  selector: 'hpa-bookings-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bookings-list-page.html',
  styleUrl: './bookings-list-page.scss'
})
export class BookingsListPage {
  protected readonly bookings = signal<Booking[]>([
    { id: '1', userName: 'Alex', braiderName: 'Janelle B.', serviceName: 'Knotless Braids', date: '2026-01-25', time: '10:00 AM', status: 'confirmed' },
    { id: '2', userName: 'Mia', braiderName: 'Keisha R.', serviceName: 'Goddess Locs', date: '2026-01-26', time: '2:00 PM', status: 'pending' },
    { id: '3', userName: 'Jayla', braiderName: 'Nia S.', serviceName: 'Cornrows', date: '2026-01-20', time: '11:00 AM', status: 'completed' },
    { id: '4', userName: 'Destiny', braiderName: 'Tamika W.', serviceName: 'Box Braids', date: '2026-01-18', time: '9:00 AM', status: 'cancelled' }
  ]);

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'badge--success';
      case 'pending': return 'badge--warning';
      case 'completed': return 'badge--info';
      case 'cancelled': return 'badge--error';
      default: return '';
    }
  }
}
