import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface StatCard {
  icon: string;
  iconClass: string;
  value: string | number;
  label: string;
  trend?: { direction: 'up' | 'down'; text: string };
}

interface ActivityItem {
  icon: string;
  iconClass: string;
  text: string;
  highlight?: string;
  time: string;
}

@Component({
  selector: 'hpa-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage {
  protected readonly stats = signal<StatCard[]>([
    {
      icon: 'content_cut',
      iconClass: 'stat-card__icon--primary',
      value: 48,
      label: 'Total Braiders',
      trend: { direction: 'up', text: '+5 this month' }
    },
    {
      icon: 'people',
      iconClass: 'stat-card__icon--success',
      value: 312,
      label: 'Active Users',
      trend: { direction: 'up', text: '+28 this week' }
    },
    {
      icon: 'event',
      iconClass: 'stat-card__icon--warning',
      value: 89,
      label: 'Pending Bookings'
    },
    {
      icon: 'star',
      iconClass: 'stat-card__icon--accent',
      value: '4.8',
      label: 'Average Rating'
    }
  ]);

  protected readonly recentActivity = signal<ActivityItem[]>([
    {
      icon: 'check_circle',
      iconClass: 'activity-item__icon--success',
      text: 'Booking confirmed for',
      highlight: 'Janelle B.',
      time: '2 hours ago'
    },
    {
      icon: 'person_add',
      iconClass: 'activity-item__icon--info',
      text: 'New braider registered:',
      highlight: 'Keisha R.',
      time: '5 hours ago'
    },
    {
      icon: 'star',
      iconClass: 'activity-item__icon--warning',
      text: 'New 5-star review for',
      highlight: 'Nia S.',
      time: 'Yesterday'
    },
    {
      icon: 'report',
      iconClass: '',
      text: 'Review flagged for moderation',
      time: '2 days ago'
    }
  ]);

  protected readonly filterOptions = signal(['All', 'Braiders', 'Users', 'Bookings', 'Reviews']);
  protected readonly activeFilter = signal('All');

  protected setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
