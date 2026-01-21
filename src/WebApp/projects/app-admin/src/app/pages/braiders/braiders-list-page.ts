import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Braider {
  id: string;
  name: string;
  location: string;
  hourlyRate: number;
  availability: 'available' | 'limited' | 'unavailable';
  updatedAt: string;
}

@Component({
  selector: 'hpa-braiders-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './braiders-list-page.html',
  styleUrl: './braiders-list-page.scss'
})
export class BraidersListPage {
  protected readonly braiders = signal<Braider[]>([
    { id: '1', name: 'Janelle B.', location: 'Atlanta, GA', hourlyRate: 85, availability: 'available', updatedAt: '2h ago' },
    { id: '2', name: 'Keisha R.', location: 'Houston, TX', hourlyRate: 70, availability: 'limited', updatedAt: 'Yesterday' },
    { id: '3', name: 'Nia S.', location: 'Los Angeles, CA', hourlyRate: 120, availability: 'unavailable', updatedAt: '4d ago' },
    { id: '4', name: 'Tamika W.', location: 'Chicago, IL', hourlyRate: 95, availability: 'available', updatedAt: '1w ago' }
  ]);

  protected getAvailabilityClass(availability: string): string {
    switch (availability) {
      case 'available': return 'badge--success';
      case 'limited': return 'badge--warning';
      case 'unavailable': return 'badge--error';
      default: return '';
    }
  }

  protected getAvailabilityLabel(availability: string): string {
    switch (availability) {
      case 'available': return 'Available';
      case 'limited': return 'Limited';
      case 'unavailable': return 'Unavailable';
      default: return availability;
    }
  }
}
