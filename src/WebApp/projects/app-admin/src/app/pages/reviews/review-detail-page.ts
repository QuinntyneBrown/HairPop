import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'hpa-review-detail-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './review-detail-page.html',
  styleUrl: './review-detail-page.scss'
})
export class ReviewDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly reviewId = signal<string | null>(null);
  protected readonly userName = signal('Alex');
  protected readonly userEmail = signal('alex@example.com');
  protected readonly braiderName = signal('Janelle B.');
  protected readonly rating = signal(5);
  protected readonly comment = signal('Amazing work! Love my knotless braids. Janelle was very professional and the braids came out perfect. Will definitely be coming back!');
  protected readonly date = signal('2026-01-20');
  protected readonly status = signal<'approved' | 'pending' | 'flagged'>('pending');

  constructor() {
    this.route.params.subscribe(params => {
      this.reviewId.set(params['id']);
    });
  }

  protected approve(): void {
    this.status.set('approved');
  }

  protected flag(): void {
    this.status.set('flagged');
  }

  protected delete(): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.router.navigate(['/reviews']);
    }
  }

  protected getStatusClass(): string {
    switch (this.status()) {
      case 'approved': return 'badge--success';
      case 'pending': return 'badge--warning';
      case 'flagged': return 'badge--error';
      default: return '';
    }
  }

  protected getStars(): number[] {
    return Array(5).fill(0).map((_, i) => i < this.rating() ? 1 : 0);
  }
}
