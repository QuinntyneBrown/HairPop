import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Review {
  id: string;
  userName: string;
  braiderName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'flagged';
}

@Component({
  selector: 'hpa-reviews-list-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reviews-list-page.html',
  styleUrl: './reviews-list-page.scss'
})
export class ReviewsListPage {
  protected readonly reviews = signal<Review[]>([
    { id: '1', userName: 'Alex', braiderName: 'Janelle B.', rating: 5, comment: 'Amazing work! Love my knotless braids...', date: '2026-01-20', status: 'approved' },
    { id: '2', userName: 'Mia', braiderName: 'Keisha R.', rating: 4, comment: 'Great experience overall, very professional...', date: '2026-01-19', status: 'pending' },
    { id: '3', userName: 'Jayla', braiderName: 'Nia S.', rating: 2, comment: 'Not satisfied with the results...', date: '2026-01-18', status: 'flagged' },
    { id: '4', userName: 'Destiny', braiderName: 'Tamika W.', rating: 5, comment: 'Best braider in the city!', date: '2026-01-15', status: 'approved' }
  ]);

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'badge--success';
      case 'pending': return 'badge--warning';
      case 'flagged': return 'badge--error';
      default: return '';
    }
  }

  protected getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}
