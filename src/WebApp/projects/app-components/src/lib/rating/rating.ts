import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
  @Input() value: number = 5;
  @Input() reviewCount: number = 0;
  @Input() showCount: boolean = true;

  get stars(): string {
    return '⭐'.repeat(Math.round(this.value));
  }

  get emptyStars(): string {
    return '☆'.repeat(5 - Math.round(this.value));
  }
}
