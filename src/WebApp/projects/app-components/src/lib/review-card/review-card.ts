import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-review-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
})
export class ReviewCard {
  @Input() reviewerName: string = '';
  @Input() date: string = '';
  @Input() rating: number = 5;
  @Input() reviewText: string = '';

  get stars(): string {
    return '⭐'.repeat(Math.round(this.rating));
  }
}
