import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface BraiderService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

interface Availability {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

@Component({
  selector: 'hpa-braider-detail-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './braider-detail-page.html',
  styleUrl: './braider-detail-page.scss'
})
export class BraiderDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly braiderId = signal<string | null>(null);
  protected readonly isNew = signal(false);

  protected readonly name = signal('Janelle B.');
  protected readonly bio = signal('Professional braider with 10+ years of experience specializing in knotless braids and protective styles.');
  protected readonly location = signal('Atlanta, GA');
  protected readonly hourlyRate = signal(85);
  protected readonly isAvailable = signal(true);
  protected readonly profileImageUrl = signal('https://.../braider.jpg');

  protected readonly services = signal<BraiderService[]>([
    { id: '1', name: 'Knotless Braids', price: 200, durationMinutes: 240, description: 'Medium length knotless box braids' },
    { id: '2', name: 'Goddess Locs', price: 250, durationMinutes: 300, description: 'Soft locs with curly ends' },
    { id: '3', name: 'Cornrows', price: 100, durationMinutes: 120, description: 'Traditional straight-back cornrows' }
  ]);

  protected readonly availabilities = signal<Availability[]>([
    { id: '1', dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
    { id: '2', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
    { id: '3', dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
    { id: '4', dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', isActive: true },
    { id: '5', dayOfWeek: 'Friday', startTime: '09:00', endTime: '15:00', isActive: true },
    { id: '6', dayOfWeek: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: false }
  ]);

  constructor() {
    this.route.params.subscribe(params => {
      if (params['id'] === 'new') {
        this.isNew.set(true);
        this.clearForm();
      } else {
        this.braiderId.set(params['id']);
        // In real app, load braider data
      }
    });
  }

  private clearForm(): void {
    this.name.set('');
    this.bio.set('');
    this.location.set('');
    this.hourlyRate.set(0);
    this.isAvailable.set(true);
    this.profileImageUrl.set('');
    this.services.set([]);
    this.availabilities.set([]);
  }

  protected save(): void {
    console.log('Saving braider...');
    // In real app, call API
    this.router.navigate(['/braiders']);
  }

  protected delete(): void {
    if (confirm('Are you sure you want to delete this braider?')) {
      console.log('Deleting braider...');
      this.router.navigate(['/braiders']);
    }
  }

  protected addService(): void {
    const name = prompt('Enter service name:');
    const price = prompt('Enter price:');
    const duration = prompt('Enter duration (minutes):');
    if (name && price && duration) {
      this.services.update(svcs => [...svcs, {
        id: Date.now().toString(),
        name,
        price: parseFloat(price),
        durationMinutes: parseInt(duration, 10),
        description: ''
      }]);
    }
  }

  protected removeService(id: string): void {
    this.services.update(svcs => svcs.filter(s => s.id !== id));
  }

  protected toggleAvailability(): void {
    this.isAvailable.update(v => !v);
  }
}
