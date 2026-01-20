import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'hpa-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private authService = inject(AuthService);

  readonly user = this.authService.user;

  stats = [
    { label: 'Total Users', value: '1,234', icon: 'people', color: '#667eea' },
    { label: 'Active Braiders', value: '89', icon: 'content_cut', color: '#4caf50' },
    { label: 'Pending Bookings', value: '23', icon: 'event', color: '#ff9800' },
    { label: 'Reviews Today', value: '45', icon: 'star', color: '#e91e63' }
  ];
}
